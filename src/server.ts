import { decodeJWT, verifyJWS } from 'did-jwt';
import { JWTDecoded } from 'did-jwt/lib/JWT.js';
import { JsonWebKey, DIDResolutionResult, DIDDocument, VerificationMethod } from 'did-resolver';
import { DocumentEntry, ServerState } from './interfaces/index.js';
import { Storage } from './store/storage.js';
import { BlockcoreIdentityTools } from '@blockcore/identity';
import * as lexint from 'lexicographic-integer-encoding';
import * as validate from './schemas.cjs';

import * as cbor from '@ipld/dag-cbor';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { importer } from 'ipfs-unixfs-importer';
import * as Secp256k1 from '@noble/secp256k1';

export function didNotFound(result: DIDResolutionResult) {
	return result.didResolutionMetadata.error === 'notFound';
}

export class Server {
	private storage: Storage;
	// private textEncoder = new TextEncoder();
	private textDecoder = new TextDecoder();
	private tools = new BlockcoreIdentityTools();

	constructor(location = './blockcore-did-database', private didMethod: string = 'did:is') {
		this.storage = new Storage(location);
	}

	async start() {
		console.log('Starting Server...');

		await this.storage.open();

		return this.storage.initialize();
	}

	async stop() {
		return this.storage.close();
	}

	async getState(url: string) {
		return await this.storage.get<ServerState>(url, 'serverstate');
	}

	async setState(server: string, state: ServerState) {
		this.storage.putServerState(server, state);
	}

	/** Extracts the domain and/or public key from the DID. */
	private databaseId(did: string) {
		return did.substring(did.lastIndexOf(':') + 1);
	}

	async list(sequence: number) {
		const db = this.storage.database();
		const iterator = db.sublevel('update').iterator<string, any>({ gt: sequence.toString(), limit: 5, keyEncoding: lexint.default('hex'), valueEncoding: 'json' });
		const dids: any[] = [];

		for await (const [key, value] of iterator) {
			dids.push({
				seq: key,
				did: `${this.didMethod}:${value.id}`,
				ver: value.version,
			});
		}

		return dids;
	}

	// https://github.com/block-core/blockcore-did-resolver
	/** This is a generic resolve method that is to be used by the Universal DID Resolver */
	async resolve(did: string, version?: number): Promise<{ status: number; result: DIDResolutionResult }> {
		if (!did.startsWith(this.didMethod)) {
			return {
				status: 501,
				result: { didDocument: null, didDocumentMetadata: {}, didResolutionMetadata: { error: 'methodNotSupported' } },
			};
		}

		let doc: DocumentEntry | undefined;
		const id = this.databaseId(did);

		if (version != null) {
			const queryId = `${id}#${version}`;
			doc = await this.storage.get(queryId, 'history');

			// If the historical version is not found, we will check if the requested version is same as the last active one and return that.
			if (!doc) {
				const tempDoc = await this.storage.get<DocumentEntry>(id);

				if (Number(tempDoc?.jws.payload['version']) === version) {
					doc = tempDoc;
				}
			}
		} else {
			doc = await this.storage.get<DocumentEntry>(id);
		}

		if (!doc) {
			return {
				status: 404,
				result: {
					didDocument: null,
					didDocumentMetadata: {},
					didResolutionMetadata: { error: 'notFound' },
				},
			};
		}

		const didDocument = doc.jws.payload['didDocument'];
		const existingVersion = Number(doc.jws.payload['version']);
		let nextVersionId: string | undefined = String(existingVersion + 1);

		// Do not return nextVersionId for deleted DID Documents.
		if (didDocument == null) {
			nextVersionId = undefined;
		}

		const result: DIDResolutionResult = {
			didDocument: didDocument,
			didDocumentMetadata: {
				versionId: String(existingVersion),
				nextVersionId: nextVersionId,
				updated: String(doc.jws.payload.iat),
				// created: jws.payload.iat,
				deactivated: didDocument == null,
				proof: {
					type: 'JwtProof2020',
					jwt: `${doc.jws.data}.${doc.jws.signature}`,
				},
			},
			didResolutionMetadata: {
				contentType: 'application/did+json',
				retrieved: this.tools.getTimestampInSeconds(),
			},
		};

		return { status: 200, result: result };
	}

	async update(did: string, document: DocumentEntry) {
		const id = this.databaseId(did);
		return this.storage.putDocumentEntry(id, document);
	}

	async wipe() {
		return this.storage.wipe();
	}

	private validateSchema(validationMethod: any, data: any) {
		if (validate[validationMethod](data)) {
			return true;
		} else {
			const error = validate[validationMethod].errors[0];
			throw new Error(`${validationMethod}${error.instancePath} ${error.message}`);
		}
	}

	async request(rawRequest: Uint8Array | string) {
		let requestBody;
		let jws;

		if (typeof rawRequest === 'string') {
			requestBody = rawRequest;
		} else {
			try {
				requestBody = this.textDecoder.decode(rawRequest);
			} catch {
				throw new Error('Expected body to be text.');
			}
		}

		try {
			jws = decodeJWT(requestBody);
		} catch {
			throw new Error('Expected body to be valid JSON Web Token.');
		}

		this.validateJws(jws);

		const did = this.getIdFromKid(jws.header['kid']);
		const didDocument = jws.payload['didDocument'];
		const version = jws.payload['version'];
		const kid = jws.header['kid'];

		let item: { status: number; result: DIDResolutionResult };
		let verificationMethodID: VerificationMethod;
		let verificationMethod: VerificationMethod;

		// The didDocument can be empty if the request is a delete one.
		if (didDocument != null) {
			this.validateSchema('DidDocument', didDocument);

			// The first key in verificationMethod must ALWAYS be the key used to derive the DID ID.
			// TODO: Consider simply doing a basic comparison between existing saved document and incoming document, not needing to perform too much operations.
			verificationMethodID = this.validateIdentifier(didDocument);
		}

		// If the version is 0, we don't have an existing DID Document to resolve.
		if (Number(version) === 0) {
			// Validate again here since users can submit empty version 0 requests.
			if (didDocument == null) {
				throw new Error('The didDocument must be set for initial creation of a new DID Document.');
			}

			// Get the verification method specified in the kid directly from payload when creating DID Document for the first time.
			verificationMethod = this.getAuthenticationMethod(kid, didDocument);

			// Ensure that the first verificationMethod and authentication is the same upon initial create.
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (!this.equalKeys(verificationMethod.publicKeyJwk!, verificationMethodID!.publicKeyJwk!)) {
				throw new Error('The first verificationMethod key must be the same as the kid for DID Document creation operation.');
			}

			item = await this.resolve(did);

			// Make sure we receive an notFound response
			if (!didNotFound(item.result)) {
				throw new Error('The DID Document already exists. You must increase the version number. Resolve the existing DID Document to get latest version id.');
			}

			// TODO: Check if already exists in database.
		} else {
			item = await this.resolve(did);

			if (item.result.didResolutionMetadata.error == 'notFound') {
				throw new Error(`The DID Document does not exists on this server, you must set version to 0 to create a new DID Document.`);
			}

			if (item.result.didDocumentMetadata.deactivated) {
				throw new Error('The DID Document has been deactivated and cannot be updated any longer.');
			}

			if (item.result.didDocument == null) {
				throw new Error('The DID Document has been deactivated and cannot be updated any longer.');
			}

			// Verify that the version is same as next version:
			if (Number(item.result.didDocumentMetadata.nextVersionId) !== Number(version)) {
				throw new Error('The version of the updated DID Document must correspond to the nextVersionId of the current active DID Document.');
			}

			// Get the verification method specified in the kid from the current active document.
			verificationMethod = this.getAuthenticationMethod(kid, item.result.didDocument);
		}

		// Validate the signature of the selected verification method used in the kid and the raw jws payload.
		this.validateSignature(requestBody, verificationMethod);

		// Store the decoded document:
		await this.update(did, { date: new Date(), jws: jws });

		const response = { status: 200, result: 'saved' };

		return response;
	}

	private getIdFromKid(kid: string): string {
		const [id] = kid.split('#');
		return String(id);
	}

	private equalKeys(key1: JsonWebKey, key2: JsonWebKey) {
		return key1.x === key2.x && key1.y === key1.y && key1.crv === key2.crv;
	}

	private validateJws(jws: JWTDecoded) {
		if (jws.header.alg !== 'ES256K') {
			throw new Error('The header.alg must be ES256K.');
		}

		if (jws.header['kid'] == null || jws.header['kid'] == '') {
			throw new Error('The header.kid must be set.');
		}

		if (jws.payload['version'] === undefined || jws.payload['version'] === null || jws.payload['version'] === '') {
			throw new Error('The payload.version must be set.');
		}

		if (Number(jws.payload['version']) < 0) {
			throw new Error('The payload.version must be positive number.');
		}

		if (!jws.payload.iat) {
			throw new Error('The payload.iat must be set.');
		}
	}

	private async validateSignature(jws: string, verificationMethod: VerificationMethod) {
		const result = await verifyJWS(jws, verificationMethod);
		return result;
	}

	private validateKey(jwk: JsonWebKey | undefined) {
		if (jwk == null) {
			throw new Error('Invalid jwk. kty MUST be EC. crv MUST be secp256k1.');
		}

		if (jwk.kty !== 'EC' || jwk.crv !== 'secp256k1') {
			throw new Error('Invalid jwk. kty MUST be EC. crv MUST be secp256k1.');
		}
	}

	/** If the version is 0, we will require that the initial request is signed with a key that verifies the actual DID ID. */
	private validateIdentifier(didDocument: DIDDocument) {
		if (didDocument.verificationMethod == null || didDocument.verificationMethod.length == 0 || didDocument.verificationMethod[0] == null) {
			throw new Error('The list of verificationMethod must be 1 or more.');
		}

		// Get the first verificationMethod, which must always be there.
		const verificationMethod = didDocument.verificationMethod[0];
		this.validateKey(verificationMethod.publicKeyJwk);

		// Verify that the public key of the verificationMethod found generates the correct DID Subject.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const identifier = this.tools.getIdentifierFromJsonWebKey(verificationMethod.publicKeyJwk!);
		const didId = `${this.didMethod}:${identifier}`;

		// The derived identfier from the initial key signing the request MUST equal the DID ID.
		if (didId !== didDocument.id) {
			throw new Error('The DID ID does not correspond to the key provided in the request.');
		}

		return verificationMethod;
	}

	/** Attempts to find the verificationMethod (key) specified in the kid among items in the "authentcation" list. */
	private getAuthenticationMethod(kid: string, didDocument: DIDDocument): VerificationMethod {
		if (didDocument == null) {
			throw new Error('Verification key needed to verify request was not found in DID Document.');
		}

		let verificationMethod: VerificationMethod | undefined;
		let keyId = '';

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		for (const vm of didDocument.authentication!) {
			// Check if the key is a reference of full value:
			if (typeof vm === 'string') {
				if (kid.endsWith(vm)) {
					keyId = vm;
					break;
				}
			} else {
				if (kid.endsWith(vm.id)) {
					verificationMethod = vm;
					break;
				}
			}
		}

		// If the vm that was found is string, we need to look up in the verificationMethod list.
		if (keyId) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			for (const vm of didDocument.verificationMethod!) {
				if (keyId.endsWith(vm.id)) {
					verificationMethod = vm;
					break;
				}
			}
		}

		if (!verificationMethod) {
			throw new Error('Verification key needed to verify request was not found in DID Document.');
		}

		return verificationMethod;
	}

	/** Generates a CID from the hash of CBOR encoded payload. The payload should just be normal JavaScript (JSON) object. */
	async generateCid(payload: any): Promise<CID> {
		const payloadBytes = cbor.encode(payload);
		const payloadHash = await sha256.digest(payloadBytes);
		return await CID.createV1(cbor.code, payloadHash);
	}

	/** Can parse a string hash to CID */
	parseCid(str: string): CID {
		const cid = CID.parse(str).toV1();
		return cid;
	}
}
