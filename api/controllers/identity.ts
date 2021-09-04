import { Handler } from "../types";
import { Vault, IVault } from '../data/models/vault';
import { Identity, IIdentityDocument } from "../data/models/identity";
import { getOperation, storeEvent, storeOperation } from "../data/event-store";
import { decodeJWT, verifyJWS, verifyJWT } from "did-jwt";
import * as bs58 from 'bs58';
import { payments } from "bitcoinjs-lib";
const { performance } = require('perf_hooks');
import { log } from '../services/logger';

export const getVerifiableCredentials: Handler = async (req, res) => {

    const { page = 1, limit = 10 } = req.query;
    var pageNumber = page as number;
    var limitNumber = limit as number;

    if (limitNumber > 100) {
        res.status(500).json({ status: 500, message: 'The limit can be maxium 100.' });
    }

    try {
        // execute query with page and limit values
        const data = await Vault.find()
            .limit(limitNumber * 1)
            .skip((pageNumber - 1) * limitNumber)
            .exec();

        // get total documents in the Posts collection 
        const count = await Vault.countDocuments();

        // return response with posts, total pages, and current page
        res.json({
            data,
            totalNumber: count,
            totalPages: Math.ceil(count / limitNumber),
            currentPage: page
        });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /vault/{id}:
 *   get:
 *     summary: Update an Vault
 *     tags: [Identity]
 *     security: []
 *     responses:
 *       200:
 *         description: 
 */
export const putVault: Handler = async (req, res) => {

    var vaultId = req.params.id;

    var vault = new Vault({ name: "TEST1" });
    await vault.save();

    log.info(req.body);
    res.send({ 'status': 'ok' });
};

/**
 * @swagger
 * /vault/:
 *   delete:
 *     summary: Delete an Vault
 *     tags: [Identity]
 *     security: []
 *     responses:
 *       200:
 *         description: 
 */
export const deleteVault: Handler = (req, res) => {
    res.send({
        '@context': 'https://www.w3.org/ns/did/v1',
        'id': 'did:web:dv1.blockcore.net'
    });
};

/**
 * @swagger
 * /vault/{id}:
 *   get:
 *     summary: Get an Vault
 *     tags: [Identity]
 *     security: []
 *     responses:
 *       200:
 *         description: 
 */
export const getVault: Handler = async (req, res) => {
    var vaultId = req.params.id;

    res.send({
        '@context': 'https://identity.foundation/.well-known/did-configuration/v1',
        'linked_dids': [vaultId]
    });
};

export const getDocument: Handler = async (req, res) => {

    res.send({
        "id": "urn:uuid:94684128-c42c-4b28-adb0-aec77bf76044",
        "meta": {
            "created": "2019-06-18"
        },
        "content": {
            "message": "Hello World!"
        }
    });
};

export const getStream: Handler = async (req, res) => {

    res.send({
        "id": "urn:uuid:41289468-c42c-4b28-adb0-bf76044aec77",
        "meta": {
            "created": "2019-06-19",
            "contentType": "video/mpeg",
            "chunks": 16
        },
        "stream": {
            "id": "https://example.com/encrypted-data-vaults/zMbxmSDn2Xzz?hl=zb47JhaKJ3hJ5Jkw8oan35jK23289Hp"
        }
    });
};

export const getEncryptedDocument: Handler = async (req, res) => {

    res.send({
        "id": "z19x9iFMnfo4YLsShKAvnJk4L",
        "sequence": 0,
        "indexed": [
            {
                "hmac": {
                    "id": "did:ex:12345#key1",
                    "type": "Sha256HmacKey2019"
                },
                "sequence": 0,
                "attributes": [
                ]
            }
        ],
        "jwe": {
            "protected": "eyJlbmMiOiJDMjBQIn0",
            "recipients": [
                {
                    "header": {
                        "kid": "urn:123",
                        "alg": "ECDH-ES+A256KW",
                        "epk": {
                            "kty": "OKP",
                            "crv": "X25519",
                            "x": "d7rIddZWblHmCc0mYZJw39SGteink_afiLraUb-qwgs"
                        },
                        "apu": "d7rIddZWblHmCc0mYZJw39SGteink_afiLraUb-qwgs",
                        "apv": "dXJuOjEyMw"
                    },
                    "encrypted_key": "4PQsjDGs8IE3YqgcoGfwPTuVG25MKjojx4HSZqcjfkhr0qhwqkpUUw"
                }
            ],
            "iv": "FoJ5uPIR6HDPFCtD",
            "ciphertext": "tIupQ-9MeYLdkAc1Us0Mdlp1kZ5Dbavq0No-eJ91cF0R0hE",
            "tag": "TMRcEPc74knOIbXhLDJA_w"
        }
    });
};

enum OperationType {
    Create = 'create', // Create an initial DID Document. This operation must have sequence number 0.
    Update = 'update', // Updates an existing DID Document, should fail if existing document not exists. Operation must have sequence number that follows previously known sequence, 1 or higher.
    Deactivate = 'deactivate', // When a deactivate is requested, the vault will keep the data but not respond with data upon request.
    Delete = 'delete', // When a delete is requested, the vault will physically delete the DID Document. This is not a guarantee, anyone can run archieve nodes, but it should be respected. Deleted DIDs should not ever be replaceable, all new operations on the same DID should fail.
    Recover = 'recover' // TODO: Figure out how we want to support recover.
}

interface OperationRequestModel {
    operation: OperationType,
    sequence: number,
    payload: string
}

var addOperation = {
    "operation": "create",
    "payload": "string"
};

var replaceOperation = {
    "operation": "replace",
    "payload": "string"
};

var deactivateOperation = {
    "operation": "deactivate",
    "payload": "string" // { id: 'id' }
};

var deleteOperation = {
    "operation": "delete",
    "payload": "string" // { id: 'id' }
};

/** Gets the latest available instance of the identity document. */
const getLatestIdentity = async (id: string) => {
    const item = await Identity.findOne({ id: id }, null, { sort: { sequence: -1 } });
    log.info('LATEST IDENTITY');
    log.info(JSON.stringify(item));
    return item;
}

const getIdentityBySequence = async (id: string, sequence: number) => {
    log.info(`getIdentityBySequence: ${sequence} - ID: ${id}`);
    const item = await Identity.findOne({ id: id, sequence: sequence });
    log.info('IDENTITY:');
    log.info(JSON.stringify(item));
    return item;
}

/**
 * @swagger
 * /identity/{id}:
 *   get:
 *     summary: Get a specific identity.
 *     tags: [Vault]
 *     security: []
 */
export const getDIDDocument: Handler = async (req, res) => {
    try {
        // Specification: https://w3c-ccg.github.io/did-resolution/
        var t0 = performance.now();

        var didResolution: any = {
            // "@context": "https://w3id.org/did-resolution/v1" // We only support application/did+json.
        }

        const item = await getLatestIdentity(req.params.id);

        console.log(JSON.stringify(item));

        if (!item) {
            didResolution.didResolutionMetadata = { error: 'not-found' };
            return res.json(didResolution);
        }

        const metadata: any = {
            retrieved: new Date(),
            contentType: 'application/did+json',
            sequence: -1,
            ...item.extended
        };

        const id = req.params.id;

        // TODO: Add full validation of DID ID.
        if (!id || id.length < 8) {
            metadata.error = 'invalid-did';
        }

        if (!id.startsWith('did:is:')) {
            metadata.error = 'method-not-supported';
        }

        if (metadata.error) {
            didResolution.didResolutionMetadata = metadata;
            return res.json(didResolution);
        }

        var t1 = performance.now();
        metadata.duration = Math.round((t1 - t0));
        metadata.sequence = item.sequence; // Consider using "seqNo" to use same as other DID Methods.

        // We store proof together with other metadata, but the DID specification
        // does not allow us to put proof on the document metadata, we must move to resolution
        didResolution.didDocument = item.document;
        didResolution.didResolutionMetadata = metadata; // Resolution metadata, blockchain attestation should be added here.
        didResolution.didDocumentMetadata = item.metadata; // Document metadata, can only contain these values: https://w3c.github.io/did-core/#did-document-metadata

        return res.json(didResolution);
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const getIdentities: Handler = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    var pageNumber = page as number; // TODO: Figure out a better way to ensure casting to number for this?
    var limitNumber = limit as number;

    if (limitNumber > 100) {
        res.status(500).json({ status: 500, message: 'The limit can be maxium 100.' });
    }

    try {
        // Get unique set of identities, we'll do that by only returning those with sequence as 0.
        const data = await Identity.find({ sequence: 0 })
            .limit(limitNumber * 1)
            .skip((pageNumber - 1) * limitNumber)
            .exec();

        const count = await Identity.countDocuments();

        res.json({
            data,
            totalNumber: count,
            totalPages: Math.ceil(count / limitNumber),
            currentPage: page
        });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

const inputValidation = (value: any, message?: string) => {
    if (!value) {
        throw Error(message);
    }
};

const getProfileNetwork = () => {
    return {
        messagePrefix: '\x18Identity Signed Message:\n',
        bech32: 'id',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 55,
        scriptHash: 117,
        wif: 0x08
    };
}

/** Get the address (identity) of this DID. Returned format is "did:is:[identity]" */
const getIdentity = (options: { publicKeyBase58?: string | any, publicKeyBuffer?: Buffer }) => {
    // If the buffer is not supplied, then we'll convert base58 to buffer.
    var publicKeyBuffer = options.publicKeyBuffer || bs58.decode(options.publicKeyBase58)

    const { address } = payments.p2pkh({
        pubkey: publicKeyBuffer,
        network: getProfileNetwork(),
    });

    // TODO: Make this configureable or move somewhere it's a shared value.
    const PREFIX = 'did:is:';

    return `${PREFIX}${address}`;
}

const verifyPublicKeyId = (identity: string, verificationMethod: any[]) => {
    for (var index in verificationMethod) {
        var method = verificationMethod[index];

        if (identity = getIdentity(method)) {
            return;
        }
    }

    throw Error('The value of the DID must be linked to one of the public keys in verificationMethod.');
}

export const processOperation = async (options: { sync: boolean, jwt: string, type?: string, operation?: string, sequence?: number, id?: string, published?: Date, received?: Date }) => {
    // Decode the payload, we'll store both decoded and original value in MongoDB for purposes of Vault Sync.
    var decoded = decodeJWT(options.jwt);

    console.log('processOperation::decoded:');
    console.log(JSON.stringify(decoded));

    var documentJwt = decoded.payload.content;

    // Decode the content, we'll get the unique document ID from there.
    var decodedContent = decodeJWT(documentJwt);

    console.log('processOperation::decodedContent:');
    console.log(JSON.stringify(decodedContent));

    // Get a reference to the payload which we want to store in our event store.
    var operation = decoded.payload;

    // Perform input validation after decoding.
    inputValidation(operation.type, '"type" is required on the operation.');
    inputValidation(operation.operation, '"operation" is required on the operation.');
    inputValidation(operation.sequence != null, '"sequence" is required on the operation.'); // null/undefined not allowed, but "0" is correct.
    inputValidation(decodedContent.payload.id, '"id" is required on the payload.');

    const alreadyExists = await getOperation(operation.type, operation.operation, operation.sequence, decodedContent.payload.id);

    if (alreadyExists) {
        log.info(`The operation already exists, skipping: ${operation.type}, ${operation.operation}, ${operation.sequence}, ${decodedContent.payload.id}.`);
        return;
    } else {
        log.info(`Does not exists yet:${operation.type}, ${operation.operation}, ${operation.sequence}, ${decodedContent.payload.id}.`);
    }

    console.log('processOperation::decodedContent2:');
    console.log(JSON.stringify(decodedContent));

    if (operation.operation == 'create' && operation.sequence != 0) {
        inputValidation(false, '"sequence" must be 0 for all "create" operations.');
    }

    // Make sure that issuer on operation JWT and ID of payload JWT is the same.
    if (decoded.header.issuer != decodedContent.payload.id) {
        throw Error('The "id" is incorrect between operation and the payload.');
    }

    // TODO: VERIFY IF THIS IS ANY CONCERN ANY LONGER? DON'T THINK IT IS, SINCE WE ARE SIMPLY PROCESSING THE JWT AND NOT OTHER METADATA.
    // Make sure that the metadata received from server/client during sync is same as the actually signed JWT. This is important or else a vault can send sequence and ID of
    // documents and block future sync.
    // if (options.sync) {
    // if (decoded.header.issuer != options.id) {
    //     log.error(JSON.stringify(decoded.payload));
    //     log.error(JSON.stringify(options));
    //     throw Error('The "id" is incorrect between synced event and signed payload.');
    // }

    // if (decoded.payload.type != options.type) {
    //     log.error(JSON.stringify(decoded.payload));
    //     log.error(JSON.stringify(options));
    //     throw Error('The "type" is incorrect between synced event and signed payload.');
    // }

    // if (decoded.payload.sequence != options.sequence) {
    //     log.error(JSON.stringify(decoded.payload));
    //     log.error(JSON.stringify(options));
    //     throw Error('The "sequence" is incorrect between synced event and signed payload.');
    // }
    // }

    var verificationMethod = null;
    var documentId = decodedContent.payload.id;
    var sequence = operation.sequence;

    var created = new Date();
    var now = new Date();
    var modified = undefined;

    // When the operation type is identity, we'll get the 'verificationMethod' directly from the payload.
    // For all other operations, we will use DID Resolve to get the correct verification method.
    if (operation.type == 'identity') {
        verificationMethod = decodedContent.payload.verificationMethod;

        // Make sure we don't process DID Documents with a lot of keys, a minor validation to reduce attack surface.
        if (verificationMethod.length > 10) {
            throw Error('Only 10 or less active verification methods support.');
        }

        // TODO: Add support for "controller" on the DID Document. This can be used to define which DIDs should be allowed to run
        // updates on the DID Document. The initial creation must still include public key of the DID in question for DID ID verification,
        // but future updates can be verified by doing an DID Resolve based upon the controllers and getting the authentication keys from
        // that DID Document.

        // Upon initial create, we'll verify that the DID ID corresponds to one of the verification method public keys.
        if (sequence == 0) {
            // Verify will will throw error if verification fails.

            // Verify the operation token.
            // TODO: Should we perhaps use the "authentication" part of the DID Document to verify operations?
            verifyJWS(options.jwt, verificationMethod);

            // Verify the document token.
            verifyJWS(decoded.payload.content, verificationMethod);

            console.log('processOperation::decodedContent3:');
            console.log(JSON.stringify(decodedContent));

            // Verify that the issuer of both JWTs and DID Document ID is same.
            if ((new Set([decoded.header.issuer, decodedContent.header.issuer, documentId])).size !== 1) {
                throw Error('The issuer of both operation and document must be equal to the DID Document ID');
            }

            console.log('processOperation::decodedContent4:');
            console.log(JSON.stringify(decodedContent));

            // Verify that the DID ID is correctly correlated with at least one of the keys provided in verificationMethod.
            // This will stop using random/custom "did:is:VALUE" for the initial creation. Upon later updates, the verificationMethod
            // can be updated and the original public key that correspond with the VALUE part of the DID ID can be recycled/removed.
            verifyPublicKeyId(documentId, verificationMethod);
        } else {
            // Upon updates, we'll allow replacement of verification method if needed.
            // On updates, we need to get existing verification methods and verify against that, to ensure that 
            // only existing owners are allowed to perform updates.
            // const latestIdentity = await getLatestIdentity(documentId);

            const latestIdentity = await getIdentityBySequence(documentId, (sequence - 1));

            if (!latestIdentity) {
                throw Error('Unable to find the previous DID Document. Cannot update. Ensure that the sequence number is correct.');
            }

            // Make sure the new sequence has same created date as previous update.
            created = latestIdentity.metadata.created;

            // Make sure we set an modified date on this update.
            modified = new Date();

            // If the previous sequence is not exactly one less, don't allow this update to continue.
            // if ((latestIdentity.sequence != (sequence - 1))) {
            //     throw Error(`Unable to update DID Document. Sequence number is incorrect. Current ${latestIdentity.sequence} and supplied ${sequence}.`);
            // }

            // Verify the operation token based upon existing verification method.
            // TODO: Should we perhaps use the "authentication" part of the DID Document to verify operations?
            verifyJWS(options.jwt, latestIdentity.document.verificationMethod);

            // Verify the document token based on existing verification method.
            verifyJWS(decoded.payload.content, latestIdentity.document.verificationMethod);

            // TODO: Should we ensure that there is always one verificationMethod? Do we want to allow users to publish DID Documents that cannot
            // be updated in the future? Perhaps that is a use-case that is valid when "controller" support is added?
        }
    }
    else {
        // TODO: Implement DID Resolver lookup for verification.
        // Get the Resolver used to resolver DID Documents from REST API.
        //const resolver = new Resolver(getResolver());
        // Get the Bitcoin Resolver used to resolver DID Documents from REST API.
        // const resolver = new Resolver(getResolver());

        // // Verify the payload content, which is an actual DID Document
        // console.log(decoded.payload.content);
        // console.log(jwt);

        // var verified = verifyJWS(jwt, verificationMethod);

        // console.log('Verified:');
        // console.log(verified);

        // Verify the operation, which is signed with same key.
        // var verified = await verifyJWT(jwt, { resolver: resolver });

        // console.log('Verified:');
        // console.log(jwt);

        // verified = await verifyJWT(decoded.payload.content, { resolver: resolver });

        // console.log('Verified:');
        // console.log(verified);
    }

    // Get the document identity from the decoded content's payload.
    operation.id = decodedContent.payload.id;

    // When an operation (event) is first observed, we set the published date. If the payload already has published, we'll use that.
    // We will additionally verify that the published is never more than few minutes ahead of current time, to avoid anyone manipulating
    // the dates far into the future.
    operation.published = created;
    operation.received = now;

    // Get the IP of external user, used for surveilance of abuse.
    // TODO: Verify if we should get IP using any methods here: https://stackoverflow.com/questions/19266329/node-js-get-clients-ip
    // TODO: Consider skipping storing this for privacy reasons.
    // operation.ip = req.ip;

    // Store the original JSON Web Token, which is used for syncing original operations between Vaults.
    operation.jwt = options.jwt;

    // Delete extra duplicate fields.
    delete operation.content;
    delete operation.signature;
    delete operation.data;

    log.info('Event Store entry:');
    log.info(operation);

    // Store a backup of the event in our event store log.
    await storeOperation(operation);

    // Validate the payload and signature.
    // TODO: We should probably do input validation and mapping here? This is now 
    // simply done quick and dirty.
    // TODO: Validate!

    // Store the verified identity in our identity store.
    //var document = new DIDDocument(req.body);

    // Entity to be stored in a collection. IIdentityDocument
    var entity = {
        id: documentId,
        sequence: sequence,
        document: decodedContent.payload,
        metadata: { // This must follow spec: https://w3c.github.io/did-core/#did-document-metadata
            created: created, // TODO: We probably should require "iat" (issued at) for the operation request.
            modified: modified
        },
        extended: { // Extended metadata, not part of standard specification.
            proof: {
                "type": "JwtProof2020",
                "jwt": documentJwt
            }
        }
    };

    log.info('Entity Store entry:');
    log.info(entity);

    var identity = new Identity(entity);

    await identity.save();


    // After operation and identity has been saved, we'll ensure that we also broadcast the incoming request to all our connected servers.
    if (operation.sync) {
        // TODO: Implement this broadcast, it should probably happen in the sync service and not in this thread.
    }
}

/** Backup with examples, should probably be moved to an unit test in the future. */
export const processOperation2 = async (options: { sync: boolean, jwt: string, type?: string, operation?: string, sequence?: number, id?: string, published?: Date, received?: Date }) => {
    // This method is written with verbose documentation and examples, to help onboard new devs making it easier to understand and relate the
    // various formats and structures.

    var jwtExample = {
        jwt: "eyJpc3N1ZXIiOiJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCIsImFsZyI6IkVTMjU2SyJ9.eyJ0eXBlIjoiaWRlbnRpdHkiLCJvcGVyYXRpb24iOiJjcmVhdGUiLCJzZXF1ZW5jZSI6MiwiY29udGVudCI6ImV5SnBjM04xWlhJaU9pSmthV1E2YVhNNlVFMVhNVXR6TjJnMFluSndUamhHWkVSV1RIZG9VRVJMU2pkTVpFRTNiVlprWkNJc0ltRnNaeUk2SWtWVE1qVTJTeUo5LmV5SkFZMjl1ZEdWNGRDSTZXeUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2Ym5NdlpHbGtMM1l4SWwwc0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWlMQ0oyWlhKcFptbGpZWFJwYjI1TlpYUm9iMlFpT2x0N0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWphMlY1TFRFaUxDSjBlWEJsSWpvaVJXTmtjMkZUWldOd01qVTJhekZXWlhKcFptbGpZWFJwYjI1TFpYa3lNREU1SWl3aVkyOXVkSEp2Ykd4bGNpSTZJbVJwWkRwcGN6cFFUVmN4UzNNM2FEUmljbkJPT0Vaa1JGWk1kMmhRUkV0S04weGtRVGR0Vm1Sa0lpd2ljSFZpYkdsalMyVjVRbUZ6WlRVNElqb2lkMEZCUVVSclRVWlJhM0Y0WVZWUVFqaHFSM0UwV205S1ZuTmhTemxaTlUwNGNtbE5Oelo2ZFdkTk5tUWlmVjBzSW5ObGNuWnBZMlVpT2x0N0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWpZbXh2WTJ0bGVIQnNiM0psY2lJc0luUjVjR1VpT2lKQ2JHOWphMFY0Y0d4dmNtVnlJaXdpYzJWeWRtbGpaVVZ1WkhCdmFXNTBJam9pYUhSMGNITTZMeTlsZUhCc2IzSmxjaTVpYkc5amEyTnZjbVV1Ym1WMEluMHNleUpwWkNJNkltUnBaRHBwY3pwUVRWY3hTM00zYURSaWNuQk9PRVprUkZaTWQyaFFSRXRLTjB4a1FUZHRWbVJrSTJScFpISmxjMjlzZG1WeUlpd2lkSGx3WlNJNklrUkpSRkpsYzI5c2RtVnlJaXdpYzJWeWRtbGpaVVZ1WkhCdmFXNTBJam9pYUhSMGNITTZMeTl0ZVM1a2FXUXVhWE1pZlN4N0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWpaV1IySWl3aWRIbHdaU0k2SWtWdVkzSjVjSFJsWkVSaGRHRldZWFZzZENJc0luTmxjblpwWTJWRmJtUndiMmx1ZENJNkltaDBkSEJ6T2k4dmRtRjFiSFF1WW14dlkydGpiM0psTG01bGRDOGlmVjBzSW1GMWRHaGxiblJwWTJGMGFXOXVJanBiSW1ScFpEcHBjenBRVFZjeFMzTTNhRFJpY25CT09FWmtSRlpNZDJoUVJFdEtOMHhrUVRkdFZtUmtJMnRsZVMweElsMHNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSTZXeUprYVdRNmFYTTZVRTFYTVV0ek4yZzBZbkp3VGpoR1pFUldUSGRvVUVSTFNqZE1aRUUzYlZaa1pDTnJaWGt0TVNKZGZRLjNhOTNoV2UyTlZQQWdrZG1uQ0xFNlAyUkN0OVVLMlFRcnBtQjVvM0xfV2xodVdxcW1hVGJza2p2R1lDNVY5NmI2aDhUa2Ewak5zT1N3SFNTd0JHOWpBIn0.xoALgVBL8Qpt5_YZINI-khxDzak-YALWqaGMfp09_zFn-F8366Xc9Ug4qcbzsEMiDx3zpULhV5DoIFqssN9Vxg"
    };

    // Decode the payload, we'll store both decoded and original value in MongoDB for purposes of Vault Sync.
    var decoded = decodeJWT(options.jwt);

    console.log('processOperation::decoded:');
    console.log(JSON.stringify(decoded));

    var documentJwt = decoded.payload.content;
    var documentJwtExample = "eyJpc3N1ZXIiOiJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCIsImFsZyI6IkVTMjU2SyJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvZGlkL3YxIl0sImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQiLCJ2ZXJpZmljYXRpb25NZXRob2QiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQja2V5LTEiLCJ0eXBlIjoiRWNkc2FTZWNwMjU2azFWZXJpZmljYXRpb25LZXkyMDE5IiwiY29udHJvbGxlciI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkIiwicHVibGljS2V5QmFzZTU4Ijoid0FBQURrTUZRa3F4YVVQQjhqR3E0Wm9KVnNhSzlZNU04cmlNNzZ6dWdNNmQifV0sInNlcnZpY2UiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjYmxvY2tleHBsb3JlciIsInR5cGUiOiJCbG9ja0V4cGxvcmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9leHBsb3Jlci5ibG9ja2NvcmUubmV0In0seyJpZCI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkI2RpZHJlc29sdmVyIiwidHlwZSI6IkRJRFJlc29sdmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9teS5kaWQuaXMifSx7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjZWR2IiwidHlwZSI6IkVuY3J5cHRlZERhdGFWYXVsdCIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHBzOi8vdmF1bHQuYmxvY2tjb3JlLm5ldC8ifV0sImF1dGhlbnRpY2F0aW9uIjpbImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkI2tleS0xIl0sImFzc2VydGlvbk1ldGhvZCI6WyJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCNrZXktMSJdfQ.3a93hWe2NVPAgkdmnCLE6P2RCt9UK2QQrpmB5o3L_WlhuWqqmaTbskjvGYC5V96b6h8Tka0jNsOSwHSSwBG9jA";

    var decodedExample = {
        header: {
            issuer: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
            alg: 'ES256K'
        },
        payload: {
            type: 'identity',
            operation: 'create',
            sequence: 2,
            content: 'eyJpc3N1ZXIiOiJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCIsImFsZyI6IkVTMjU2SyJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvZGlkL3YxIl0sImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQiLCJ2ZXJpZmljYXRpb25NZXRob2QiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQja2V5LTEiLCJ0eXBlIjoiRWNkc2FTZWNwMjU2azFWZXJpZmljYXRpb25LZXkyMDE5IiwiY29udHJvbGxlciI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkIiwicHVibGljS2V5QmFzZTU4Ijoid0FBQURrTUZRa3F4YVVQQjhqR3E0Wm9KVnNhSzlZNU04cmlNNzZ6dWdNNmQifV0sInNlcnZpY2UiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjYmxvY2tleHBsb3JlciIsInR5cGUiOiJCbG9ja0V4cGxvcmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9leHBsb3Jlci5ibG9ja2NvcmUubmV0In0seyJpZCI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkI2RpZHJlc29sdmVyIiwidHlwZSI6IkRJRFJlc29sdmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9teS5kaWQuaXMifSx7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjZWR2IiwidHlwZSI6IkVuY3J5cHRlZERhdGFWYXVsdCIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHBzOi8vdmF1bHQuYmxvY2tjb3JlLm5ldC8ifV0sImF1dGhlbnRpY2F0aW9uIjpbImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkI2tleS0xIl0sImFzc2VydGlvbk1ldGhvZCI6WyJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCNrZXktMSJdfQ.3a93hWe2NVPAgkdmnCLE6P2RCt9UK2QQrpmB5o3L_WlhuWqqmaTbskjvGYC5V96b6h8Tka0jNsOSwHSSwBG9jA'
        },
        signature: 'xoALgVBL8Qpt5_YZINI-khxDzak-YALWqaGMfp09_zFn-F8366Xc9Ug4qcbzsEMiDx3zpULhV5DoIFqssN9Vxg',
        data: 'eyJpc3N1ZXIiOiJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCIsImFsZyI6IkVTMjU2SyJ9.eyJ0eXBlIjoiaWRlbnRpdHkiLCJvcGVyYXRpb24iOiJjcmVhdGUiLCJzZXF1ZW5jZSI6MiwiY29udGVudCI6ImV5SnBjM04xWlhJaU9pSmthV1E2YVhNNlVFMVhNVXR6TjJnMFluSndUamhHWkVSV1RIZG9VRVJMU2pkTVpFRTNiVlprWkNJc0ltRnNaeUk2SWtWVE1qVTJTeUo5LmV5SkFZMjl1ZEdWNGRDSTZXeUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2Ym5NdlpHbGtMM1l4SWwwc0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWlMQ0oyWlhKcFptbGpZWFJwYjI1TlpYUm9iMlFpT2x0N0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWphMlY1TFRFaUxDSjBlWEJsSWpvaVJXTmtjMkZUWldOd01qVTJhekZXWlhKcFptbGpZWFJwYjI1TFpYa3lNREU1SWl3aVkyOXVkSEp2Ykd4bGNpSTZJbVJwWkRwcGN6cFFUVmN4UzNNM2FEUmljbkJPT0Vaa1JGWk1kMmhRUkV0S04weGtRVGR0Vm1Sa0lpd2ljSFZpYkdsalMyVjVRbUZ6WlRVNElqb2lkMEZCUVVSclRVWlJhM0Y0WVZWUVFqaHFSM0UwV205S1ZuTmhTemxaTlUwNGNtbE5Oelo2ZFdkTk5tUWlmVjBzSW5ObGNuWnBZMlVpT2x0N0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWpZbXh2WTJ0bGVIQnNiM0psY2lJc0luUjVjR1VpT2lKQ2JHOWphMFY0Y0d4dmNtVnlJaXdpYzJWeWRtbGpaVVZ1WkhCdmFXNTBJam9pYUhSMGNITTZMeTlsZUhCc2IzSmxjaTVpYkc5amEyTnZjbVV1Ym1WMEluMHNleUpwWkNJNkltUnBaRHBwY3pwUVRWY3hTM00zYURSaWNuQk9PRVprUkZaTWQyaFFSRXRLTjB4a1FUZHRWbVJrSTJScFpISmxjMjlzZG1WeUlpd2lkSGx3WlNJNklrUkpSRkpsYzI5c2RtVnlJaXdpYzJWeWRtbGpaVVZ1WkhCdmFXNTBJam9pYUhSMGNITTZMeTl0ZVM1a2FXUXVhWE1pZlN4N0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWpaV1IySWl3aWRIbHdaU0k2SWtWdVkzSjVjSFJsWkVSaGRHRldZWFZzZENJc0luTmxjblpwWTJWRmJtUndiMmx1ZENJNkltaDBkSEJ6T2k4dmRtRjFiSFF1WW14dlkydGpiM0psTG01bGRDOGlmVjBzSW1GMWRHaGxiblJwWTJGMGFXOXVJanBiSW1ScFpEcHBjenBRVFZjeFMzTTNhRFJpY25CT09FWmtSRlpNZDJoUVJFdEtOMHhrUVRkdFZtUmtJMnRsZVMweElsMHNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSTZXeUprYVdRNmFYTTZVRTFYTVV0ek4yZzBZbkp3VGpoR1pFUldUSGRvVUVSTFNqZE1aRUUzYlZaa1pDTnJaWGt0TVNKZGZRLjNhOTNoV2UyTlZQQWdrZG1uQ0xFNlAyUkN0OVVLMlFRcnBtQjVvM0xfV2xodVdxcW1hVGJza2p2R1lDNVY5NmI2aDhUa2Ewak5zT1N3SFNTd0JHOWpBIn0'
    };

    // Decode the content, we'll get the unique document ID from there.
    var decodedContent = decodeJWT(documentJwt);

    console.log('processOperation::decodedContent:');
    console.log(JSON.stringify(decodedContent));

    var decodedContentExample = {
        header: {
            issuer: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
            alg: 'ES256K'
        },
        payload: {
            '@context': ['https://www.w3.org/ns/did/v1'],
            id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
            verificationMethod: [[Object]],
            service: [[Object], [Object], [Object]],
            authentication: ['did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#key-1'],
            assertionMethod: ['did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#key-1']
        },
        signature: '3a93hWe2NVPAgkdmnCLE6P2RCt9UK2QQrpmB5o3L_WlhuWqqmaTbskjvGYC5V96b6h8Tka0jNsOSwHSSwBG9jA',
        data: 'eyJpc3N1ZXIiOiJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCIsImFsZyI6IkVTMjU2SyJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvZGlkL3YxIl0sImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQiLCJ2ZXJpZmljYXRpb25NZXRob2QiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQja2V5LTEiLCJ0eXBlIjoiRWNkc2FTZWNwMjU2azFWZXJpZmljYXRpb25LZXkyMDE5IiwiY29udHJvbGxlciI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkIiwicHVibGljS2V5QmFzZTU4Ijoid0FBQURrTUZRa3F4YVVQQjhqR3E0Wm9KVnNhSzlZNU04cmlNNzZ6dWdNNmQifV0sInNlcnZpY2UiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjYmxvY2tleHBsb3JlciIsInR5cGUiOiJCbG9ja0V4cGxvcmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9leHBsb3Jlci5ibG9ja2NvcmUubmV0In0seyJpZCI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkI2RpZHJlc29sdmVyIiwidHlwZSI6IkRJRFJlc29sdmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9teS5kaWQuaXMifSx7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjZWR2IiwidHlwZSI6IkVuY3J5cHRlZERhdGFWYXVsdCIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHBzOi8vdmF1bHQuYmxvY2tjb3JlLm5ldC8ifV0sImF1dGhlbnRpY2F0aW9uIjpbImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkI2tleS0xIl0sImFzc2VydGlvbk1ldGhvZCI6WyJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCNrZXktMSJdfQ'
    };

    // Get a reference to the payload which we want to store in our event store.
    var operation = decoded.payload;

    // Perform input validation after decoding.
    inputValidation(operation.type, '"type" is required on the operation.');
    inputValidation(operation.operation, '"operation" is required on the operation.');
    inputValidation(operation.sequence != null, '"sequence" is required on the operation.'); // null/undefined not allowed, but "0" is correct.
    inputValidation(decodedContent.payload.id, '"id" is required on the payload.');

    console.log('processOperation::decodedContent2:');
    console.log(JSON.stringify(decodedContent));

    if (operation.operation == 'create' && operation.sequence != 0) {
        inputValidation(false, '"sequence" must be 0 for all "create" operations.');
    }

    // Make sure that issuer on operation JWT and ID of payload JWT is the same.
    if (decoded.header.issuer != decodedContent.payload.id) {
        throw Error('The "id" is incorrect between operation and the payload.');
    }

    // Make sure that the metadata received from server/client during sync is same as the actually signed JWT. This is important or else a vault can send sequence and ID of
    // documents and block future sync.
    if (options.sync) {
        if (decoded.header.issuer != options.id) {
            log.error(JSON.stringify(decoded.payload));
            log.error(JSON.stringify(options));
            throw Error('The "id" is incorrect between synced event and signed payload.');
        }

        if (decoded.payload.type != options.type) {
            log.error(JSON.stringify(decoded.payload));
            log.error(JSON.stringify(options));
            throw Error('The "type" is incorrect between synced event and signed payload.');
        }

        if (decoded.payload.sequence != options.sequence) {
            log.error(JSON.stringify(decoded.payload));
            log.error(JSON.stringify(options));
            throw Error('The "sequence" is incorrect between synced event and signed payload.');
        }
    }

    var verificationMethod = null;
    var documentId = decodedContent.payload.id;
    var sequence = operation.sequence;

    var created = new Date();
    var now = new Date();
    var modified = undefined;

    // When the operation type is identity, we'll get the 'verificationMethod' directly from the payload.
    // For all other operations, we will use DID Resolve to get the correct verification method.
    if (operation.type == 'identity') {
        verificationMethod = decodedContent.payload.verificationMethod;

        // Make sure we don't process DID Documents with a lot of keys, a minor validation to reduce attack surface.
        if (verificationMethod.length > 10) {
            throw Error('Only 10 or less active verification methods support.');
        }

        // TODO: Add support for "controller" on the DID Document. This can be used to define which DIDs should be allowed to run
        // updates on the DID Document. The initial creation must still include public key of the DID in question for DID ID verification,
        // but future updates can be verified by doing an DID Resolve based upon the controllers and getting the authentication keys from
        // that DID Document.

        // Upon initial create, we'll verify that the DID ID corresponds to one of the verification method public keys.
        if (sequence == 0) {
            // Verify will will throw error if verification fails.

            // Verify the operation token.
            // TODO: Should we perhaps use the "authentication" part of the DID Document to verify operations?
            verifyJWS(options.jwt, verificationMethod);

            // Verify the document token.
            verifyJWS(decoded.payload.content, verificationMethod);

            console.log('processOperation::decodedContent3:');
            console.log(JSON.stringify(decodedContent));

            // Verify that the issuer of both JWTs and DID Document ID is same.
            if ((new Set([decoded.header.issuer, decodedContent.header.issuer, documentId])).size !== 1) {
                throw Error('The issuer of both operation and document must be equal to the DID Document ID');
            }

            console.log('processOperation::decodedContent4:');
            console.log(JSON.stringify(decodedContent));

            // Verify that the DID ID is correctly correlated with at least one of the keys provided in verificationMethod.
            // This will stop using random/custom "did:is:VALUE" for the initial creation. Upon later updates, the verificationMethod
            // can be updated and the original public key that correspond with the VALUE part of the DID ID can be recycled/removed.
            verifyPublicKeyId(documentId, verificationMethod);
        } else {
            // Upon updates, we'll allow replacement of verification method if needed.
            // On updates, we need to get existing verification methods and verify against that, to ensure that 
            // only existing owners are allowed to perform updates.
            // const latestIdentity = await getLatestIdentity(documentId);

            const latestIdentity = await getIdentityBySequence(documentId, (sequence - 1));

            if (!latestIdentity) {
                throw Error('Unable to find the previous DID Document. Cannot update. Ensure that the sequence number is correct.');
            }

            // Make sure the new sequence has same created date as previous update.
            created = latestIdentity.metadata.created;

            // Make sure we set an modified date on this update.
            modified = new Date();

            // If the previous sequence is not exactly one less, don't allow this update to continue.
            // if ((latestIdentity.sequence != (sequence - 1))) {
            //     throw Error(`Unable to update DID Document. Sequence number is incorrect. Current ${latestIdentity.sequence} and supplied ${sequence}.`);
            // }

            // Verify the operation token based upon existing verification method.
            // TODO: Should we perhaps use the "authentication" part of the DID Document to verify operations?
            verifyJWS(options.jwt, latestIdentity.document.verificationMethod);

            // Verify the document token based on existing verification method.
            verifyJWS(decoded.payload.content, latestIdentity.document.verificationMethod);

            // TODO: Should we ensure that there is always one verificationMethod? Do we want to allow users to publish DID Documents that cannot
            // be updated in the future? Perhaps that is a use-case that is valid when "controller" support is added?
        }
    }
    else {
        // TODO: Implement DID Resolver lookup for verification.
        // Get the Resolver used to resolver DID Documents from REST API.
        //const resolver = new Resolver(getResolver());
        // Get the Bitcoin Resolver used to resolver DID Documents from REST API.
        // const resolver = new Resolver(getResolver());

        // // Verify the payload content, which is an actual DID Document
        // console.log(decoded.payload.content);
        // console.log(jwt);

        // var verified = verifyJWS(jwt, verificationMethod);

        // console.log('Verified:');
        // console.log(verified);

        // Verify the operation, which is signed with same key.
        // var verified = await verifyJWT(jwt, { resolver: resolver });

        // console.log('Verified:');
        // console.log(jwt);

        // verified = await verifyJWT(decoded.payload.content, { resolver: resolver });

        // console.log('Verified:');
        // console.log(verified);
    }

    // Get the document identity from the decoded content's payload.
    operation.id = decodedContent.payload.id;

    // When an operation (event) is first observed, we set the published date. If the payload already has published, we'll use that.
    // We will additionally verify that the published is never more than few minutes ahead of current time, to avoid anyone manipulating
    // the dates far into the future.
    operation.published = created;
    operation.received = now;

    // Get the IP of external user, used for surveilance of abuse.
    // TODO: Verify if we should get IP using any methods here: https://stackoverflow.com/questions/19266329/node-js-get-clients-ip
    // TODO: Consider skipping storing this for privacy reasons.
    // operation.ip = req.ip;

    // Store the original JSON Web Token, which is used for syncing original operations between Vaults.
    operation.jwt = options.jwt;

    // Delete extra duplicate fields.
    delete operation.content;
    delete operation.signature;
    delete operation.data;

    log.info('Event Store entry:');
    log.info(operation);

    // Store a backup of the event in our event store log.
    await storeOperation(operation);

    // Validate the payload and signature.
    // TODO: We should probably do input validation and mapping here? This is now 
    // simply done quick and dirty.
    // TODO: Validate!

    // Store the verified identity in our identity store.
    //var document = new DIDDocument(req.body);

    // Entity to be stored in a collection. IIdentityDocument
    var entity = {
        id: documentId,
        sequence: sequence,
        document: decodedContent.payload,
        metadata: { // This must follow spec: https://w3c.github.io/did-core/#did-document-metadata
            created: created, // TODO: We probably should require "iat" (issued at) for the operation request.
            modified: modified
        },
        extended: { // Extended metadata, not part of standard specification.
            proof: {
                "type": "JwtProof2020",
                "jwt": documentJwt
            }
        }
    };

    log.info('Entity Store entry:');
    log.info(entity);

    var identity = new Identity(entity);

    await identity.save();
}

/**
 * @swagger
 * /operation:
 *   post:
 *     summary: Endpoint for operations
 *     tags: [Vault]
 *     security: []
 */
export const handleOperation: Handler = async (req, res) => {
    log.info('Process a signed operation request...');

    try {
        // The only payload is the JSON Web Token.
        var jwt = req.body.jwt;

        // Since we received this operation over the REST API, we should make this operation to be synced to registered servers.
        await processOperation({ sync: true, jwt: jwt });

        res.json({ "success": true });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /identity:
 *   post:
 *     summary: VERIFY IF THIS SHOULD BE REMOVED!
 *     tags: [Vault]
 *     security: []
 */
export const createDIDDocument: Handler = async (req, res) => {
    log.info('Create DID Document...');

    try {
        // The only payload is the JSON Web Token.
        var jwt = req.body.jwt;

        // Decode the payload, we'll store both decoded and original value in MongoDB for purposes of Vault Sync.
        var decoded = decodeJWT(jwt);

        var decodedExample = {
            header: {
                issuer: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
                alg: 'ES256K'
            },
            payload: {
                type: 'identity',
                operation: 'create',
                sequence: 2,
                content: 'eyJpc3N1ZXIiOiJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCIsImFsZyI6IkVTMjU2SyJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvZGlkL3YxIl0sImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQiLCJ2ZXJpZmljYXRpb25NZXRob2QiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQja2V5LTEiLCJ0eXBlIjoiRWNkc2FTZWNwMjU2azFWZXJpZmljYXRpb25LZXkyMDE5IiwiY29udHJvbGxlciI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkIiwicHVibGljS2V5QmFzZTU4Ijoid0FBQURrTUZRa3F4YVVQQjhqR3E0Wm9KVnNhSzlZNU04cmlNNzZ6dWdNNmQifV0sInNlcnZpY2UiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjYmxvY2tleHBsb3JlciIsInR5cGUiOiJCbG9ja0V4cGxvcmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9leHBsb3Jlci5ibG9ja2NvcmUubmV0In0seyJpZCI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkI2RpZHJlc29sdmVyIiwidHlwZSI6IkRJRFJlc29sdmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9teS5kaWQuaXMifSx7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjZWR2IiwidHlwZSI6IkVuY3J5cHRlZERhdGFWYXVsdCIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHBzOi8vdmF1bHQuYmxvY2tjb3JlLm5ldC8ifV0sImF1dGhlbnRpY2F0aW9uIjpbImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkI2tleS0xIl0sImFzc2VydGlvbk1ldGhvZCI6WyJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCNrZXktMSJdfQ.3a93hWe2NVPAgkdmnCLE6P2RCt9UK2QQrpmB5o3L_WlhuWqqmaTbskjvGYC5V96b6h8Tka0jNsOSwHSSwBG9jA'
            },
            signature: 'xoALgVBL8Qpt5_YZINI-khxDzak-YALWqaGMfp09_zFn-F8366Xc9Ug4qcbzsEMiDx3zpULhV5DoIFqssN9Vxg',
            data: 'eyJpc3N1ZXIiOiJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCIsImFsZyI6IkVTMjU2SyJ9.eyJ0eXBlIjoiaWRlbnRpdHkiLCJvcGVyYXRpb24iOiJjcmVhdGUiLCJzZXF1ZW5jZSI6MiwiY29udGVudCI6ImV5SnBjM04xWlhJaU9pSmthV1E2YVhNNlVFMVhNVXR6TjJnMFluSndUamhHWkVSV1RIZG9VRVJMU2pkTVpFRTNiVlprWkNJc0ltRnNaeUk2SWtWVE1qVTJTeUo5LmV5SkFZMjl1ZEdWNGRDSTZXeUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2Ym5NdlpHbGtMM1l4SWwwc0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWlMQ0oyWlhKcFptbGpZWFJwYjI1TlpYUm9iMlFpT2x0N0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWphMlY1TFRFaUxDSjBlWEJsSWpvaVJXTmtjMkZUWldOd01qVTJhekZXWlhKcFptbGpZWFJwYjI1TFpYa3lNREU1SWl3aVkyOXVkSEp2Ykd4bGNpSTZJbVJwWkRwcGN6cFFUVmN4UzNNM2FEUmljbkJPT0Vaa1JGWk1kMmhRUkV0S04weGtRVGR0Vm1Sa0lpd2ljSFZpYkdsalMyVjVRbUZ6WlRVNElqb2lkMEZCUVVSclRVWlJhM0Y0WVZWUVFqaHFSM0UwV205S1ZuTmhTemxaTlUwNGNtbE5Oelo2ZFdkTk5tUWlmVjBzSW5ObGNuWnBZMlVpT2x0N0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWpZbXh2WTJ0bGVIQnNiM0psY2lJc0luUjVjR1VpT2lKQ2JHOWphMFY0Y0d4dmNtVnlJaXdpYzJWeWRtbGpaVVZ1WkhCdmFXNTBJam9pYUhSMGNITTZMeTlsZUhCc2IzSmxjaTVpYkc5amEyTnZjbVV1Ym1WMEluMHNleUpwWkNJNkltUnBaRHBwY3pwUVRWY3hTM00zYURSaWNuQk9PRVprUkZaTWQyaFFSRXRLTjB4a1FUZHRWbVJrSTJScFpISmxjMjlzZG1WeUlpd2lkSGx3WlNJNklrUkpSRkpsYzI5c2RtVnlJaXdpYzJWeWRtbGpaVVZ1WkhCdmFXNTBJam9pYUhSMGNITTZMeTl0ZVM1a2FXUXVhWE1pZlN4N0ltbGtJam9pWkdsa09tbHpPbEJOVnpGTGN6ZG9OR0p5Y0U0NFJtUkVWa3gzYUZCRVMwbzNUR1JCTjIxV1pHUWpaV1IySWl3aWRIbHdaU0k2SWtWdVkzSjVjSFJsWkVSaGRHRldZWFZzZENJc0luTmxjblpwWTJWRmJtUndiMmx1ZENJNkltaDBkSEJ6T2k4dmRtRjFiSFF1WW14dlkydGpiM0psTG01bGRDOGlmVjBzSW1GMWRHaGxiblJwWTJGMGFXOXVJanBiSW1ScFpEcHBjenBRVFZjeFMzTTNhRFJpY25CT09FWmtSRlpNZDJoUVJFdEtOMHhrUVRkdFZtUmtJMnRsZVMweElsMHNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSTZXeUprYVdRNmFYTTZVRTFYTVV0ek4yZzBZbkp3VGpoR1pFUldUSGRvVUVSTFNqZE1aRUUzYlZaa1pDTnJaWGt0TVNKZGZRLjNhOTNoV2UyTlZQQWdrZG1uQ0xFNlAyUkN0OVVLMlFRcnBtQjVvM0xfV2xodVdxcW1hVGJza2p2R1lDNVY5NmI2aDhUa2Ewak5zT1N3SFNTd0JHOWpBIn0'
        };

        // 
        var event = decoded.payload;

        // Delete extra duplicate fields.
        delete event.content;
        delete event.signature;
        delete event.data;

        log.info(decoded);

        // Store a backup of the event in our event store log.
        await storeEvent('create', 'identity', req.body, req.body.sequence);

        // Validate the payload and signature.
        // TODO: We should probably do input validation and mapping here? This is now 
        // simply done quick and dirty.
        // TODO: Validate!

        // Store the verified identity in our identity store.
        //var document = new DIDDocument(req.body);

        // var identity = new Identity();
        // identity.id = 

        // var vault = new DIDDocument(req.body);
        // await vault.save();
        res.json({ "success": true });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /identity/{id}:
 *   put:
 *     summary: VERIFY IF THIS SHOULD BE REMOVED!
 *     tags: [Vault]
 *     security: []
 */
export const updateDIDDocument: Handler = async (req, res) => {
    try {
        await storeEvent('replace', 'identity', req.body, req.body.sequence);

        var id = req.params.id;

        // TODO: We should probably do input validation and mapping here? This is now 
        // simply done quick and dirty.
        // await DIDDocument.updateOne({
        //     id: id
        // }, req.body, { upsert: true });
        res.json({ "success": true });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /identity/{id}:
 *   delete:
 *     summary: VERIFY IF THIS SHOULD BE REMOVED!
 *     tags: [Vault]
 *     security: []
 */
export const deleteDIDDocument: Handler = async (req, res) => {
    try {
        var id = req.params.id;
        await storeEvent('replace', 'identity', { id });

        await Vault.deleteOne({ id: id });
        res.json({ "success": true });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};
