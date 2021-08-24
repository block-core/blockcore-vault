import fetch from 'cross-fetch';
import {
    DIDDocument,
    DIDResolutionResult,
    DIDResolver,
    ParsedDID
} from 'did-resolver';
import { log } from '../services/logger';

const DOC_PATH = '/.well-known/did.json';
const DID_SERVER = 'www.did.is';

async function get(url: string): Promise<any> {
    const res = await fetch(url, { mode: 'cors' });

    if (res.status >= 400) {
        throw new Error(`Bad response ${res.statusText}`);
    }

    return res.json();
}

function ordered(a: any, b: any) {
    let comparison = 0;
    if (a.id > b.id) {
        comparison = 1;
    } else if (a.id < b.id) {
        comparison = -1;
    }
    return comparison;
}

/** Vault resolver that queries did-configuration, vault-configuration and resolves DID Document to verify the DomainLinkage. */
export function getVaultResolver() {
    // TODO: Implement the logic for this resolver.

    // #1: Get the did-configuration.json

    // #2: Resolve the DID Document

    // TODO: Consider skipping this and require that the DID Document actually contains the data vault URL.
    // #3: Get the vault-configuration.json. This is not signed and someone could replace this with an different/hacked data vault service.
    // 
    const vaultConfigurationExample = {
        '@context': 'https://w3id.org/encrypted-data-vaults/v1',
        "id": "did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd",
        "name": "Blockcore Vault #1",
        "dataVaultCreationService": "https://dv1.blockcore.net/"
    };
}

/** DID Method resolver for "did:is". */
export function getResolver(): Record<string, DIDResolver> {

    async function resolve(
        did: string,
        parsed: ParsedDID
    ): Promise<DIDResolutionResult> {
        let err = null;
        // let path = decodeURIComponent(parsed.id) + DOC_PATH;

        // const id = parsed.id.split(':');

        // if (id.length > 1) {
        //     path = id.map(decodeURIComponent).join('/') + '/did.json';
        // }

        // This is the ID without the DID Method prefix:
        const id = parsed.id;

        const url: string = `https://${DID_SERVER}/api/identity/${id}`;
        log.info(url);

        const didDocumentMetadata = {
            header: {
                issuer: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
                alg: 'ES256K'
            },
            signature: 'NMyiNRZC7GDt1dNHiVZo_kLWqX5T_cLySuica7VwbDpNY4mxC9HiIBJc9PurK_GSg6V_bdDME23X-O-imA7MRQ',
            data: 'eyJpc3N1ZXIiOiJkaWQ6aXM6UE1XMUtzN2g0YnJwTjhGZERWTHdoUERLSjdMZEE3bVZkZCIsImFsZyI6IkVTMjU2SyJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvZGlkL3YxIl0sImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQiLCJ2ZXJpZmljYXRpb25NZXRob2QiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQja2V5LTEiLCJ0eXBlIjoiRWNkc2FTZWNwMjU2azFWZXJpZmljYXRpb25LZXkyMDE5IiwiY29udHJvbGxlciI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkIiwicHVibGljS2V5QmFzZTU4Ijoid0FBQURrTUZRa3F4YVVQQjhqR3E0Wm9KVnNhSzlZNU04cmlNNzZ6dWdNNmQifV0sInNlcnZpY2UiOlt7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjYmxvY2tleHBsb3JlciIsInR5cGUiOiJCbG9ja0V4cGxvcmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9leHBsb3Jlci5ibG9ja2NvcmUubmV0In0seyJpZCI6ImRpZDppczpQTVcxS3M3aDRicnBOOEZkRFZMd2hQREtKN0xkQTdtVmRkI2RpZHJlc29sdmVyIiwidHlwZSI6IkRJRFJlc29sdmVyIiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly9teS5kaWQuaXMifSx7ImlkIjoiZGlkOmlzOlBNVzFLczdoNGJycE44RmREVkx3aFBES0o3TGRBN21WZGQjZWR2IiwidHlwZSI6IkVuY3J5cHRlZERhdGFWYXVsdCIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHBzOi8vdmF1bHQuYmxvY2tjb3JlLm5ldC8ifV19'
        };

        let didDocument: DIDDocument | null = null;

        didDocument = { "@context": ["https://www.w3.org/ns/did/v1"], "id": "did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd", "verificationMethod": [{ "id": "did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#key-1", "type": "EcdsaSecp256k1VerificationKey2019", "controller": "did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd", "publicKeyBase58": "wAAADkMFQkqxaUPB8jGq4ZoJVsaK9Y5M8riM76zugM6d" }], "service": [{ "id": "did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#blockexplorer", "type": "BlockExplorer", "serviceEndpoint": "https://explorer.blockcore.net" }, { "id": "did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#didresolver", "type": "DIDResolver", "serviceEndpoint": "https://my.did.is" }, { "id": "did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#edv", "type": "EncryptedDataVault", "serviceEndpoint": "https://vault.blockcore.net/" }] };

        // didDocument = {
        //     '@context': 'https://www.w3.org/ns/did/v1',
        //     id: parsed.id,
        //     service: [
        //         {
        //             "id": id + "#edv",
        //             "type": "EncryptedDataVault",
        //             "serviceEndpoint": "https://vault.blockcore.net/"
        //         },
        //         {
        //             "id": id + "#city",
        //             "type": "Payment",
        //             "serviceEndpoint": "city:CWddecDVh3vrxMpshDiABJeA98XxWr9y1t"
        //         },
        //         {
        //             "id": id + "#stamp",
        //             "type": "Stamp",
        //             "serviceEndpoint": "ecash:qp0rdwv2nzr84ru054gvqzrlnpltxaa6sqjfl86c2f",
        //             "description": "My public social inbox",
        //             // "spamCost": {
        //             //    "amount": "0.000100",
        //             //    "currency": "ecash"
        //             // }
        //         }
        //     ].sort(ordered)
        // };

        // const contentType =
        //     typeof didDocument?.['@context'] !== 'undefined'
        //         ? 'application/did+ld+json'
        //         : 'application/did+json';

        return {
            didDocument,
            didDocumentMetadata,
            didResolutionMetadata: { contentType: 'application/did+json' }
        };

        // TODO: Refactor this and apply verification of signatures for DID Documents provided by the 
        // DID:IS endpoint.

        // try {
        //    data = await get(url);
        // } catch (error) {
        //    throw new Error(`DID must resolve to a valid https URL containing a JSON document: ${error.message}`);
        // }

        // const docIdMatchesDid = data.id === did;

        // if (!docIdMatchesDid) {
        //    throw new Error('DID document id does not match requested did');
        // }

        // const docHasPublicKey = Array.isArray(data.publicKey) && data.publicKey.length > 0;

        // if (!docHasPublicKey) {
        //    throw new Error('DID document has no public keys');
        // }

        //  data = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE2MTE3OTIyOTAsIkBjb250ZXh0IjoiaHR0cHM6Ly93d3cudzMub3JnL25zL2RpZC92MSIsImlkIjoiZGlkOmlzOlBUY243N3dacmh1Z3lyeFg4QXdaeHk0eG1tcWJDdlpjS3UiLCJ2ZXJpZmljYXRpb25NZXRob2QiOlt7ImlkIjoiZGlkOmlzOlBUY243N3dacmh1Z3lyeFg4QXdaeHk0eG1tcWJDdlpjS3Uja2V5LTEiLCJ0eXBlIjoiRWNkc2FTZWNwMjU2azFWZXJpZmljYXRpb25LZXkyMDE5IiwiY29udHJvbGxlciI6ImRpZDppczpQVGNuNzd3WnJodWd5cnhYOEF3Wnh5NHhtbXFiQ3ZaY0t1IiwicHVibGljS2V5SGV4IjoiMDJEQUQ2M0E1OTFFNjlCMTlEOEREMEU0NEM1Rjk2ODNFQjgwRjI2ODRFQzhFRDg4RTI1OUFBNTZDNzE3MjZCNDdEIn1dLCJzZXJ2aWNlIjpbeyJpZCI6ImRpZDppczpQVGNuNzd3WnJodWd5cnhYOEF3Wnh5NHhtbXFiQ3ZaY0t1I2NpdHkiLCJ0eXBlIjoiUGF5bWVudCIsInNlcnZpY2VFbmRwb2ludCI6ImNpdHk6Q1dkZGVjRFZoM3ZyeE1wc2hEaUFCSmVBOThYeFdyOXkxdCJ9LHsiaWQiOiJkaWQ6aXM6UFRjbjc3d1pyaHVneXJ4WDhBd1p4eTR4bW1xYkN2WmNLdSNlZHYiLCJ0eXBlIjoiRW5jcnlwdGVkRGF0YVZhdWx0Iiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly92YXVsdC5ibG9ja2NvcmUubmV0LyJ9LHsiaWQiOiJkaWQ6aXM6UFRjbjc3d1pyaHVneXJ4WDhBd1p4eTR4bW1xYkN2WmNLdSNzdGFtcCIsInR5cGUiOiJTdGFtcCIsInNlcnZpY2VFbmRwb2ludCI6ImVjYXNoOnFwMHJkd3YybnpyODRydTA1NGd2cXpybG5wbHR4YWE2c3FqZmw4NmMyZiIsImRlc2NyaXB0aW9uIjoiTXkgcHVibGljIHNvY2lhbCBpbmJveCIsInNwYW1Db3N0Ijp7ImFtb3VudCI6IjAuMDAwMTAwIiwiY3VycmVuY3kiOiJlY2FzaCJ9fV0sImlzcyI6ImRpZDppczpQVGNuNzd3WnJodWd5cnhYOEF3Wnh5NHhtbXFiQ3ZaY0t1In0.ItCVR8FQBDS7GPB9_QE0jCt8Afkp4L9eHfGF1uxBdS2DyCJudm7-de-r4_CRUJ-hHfSh1ppc8Kd8QSNUdfe7FQ';

        //  return data;

        // {method: 'mymethod', id: 'abcdefg', did: 'did:mymethod:abcdefg/some/path#fragment=123', path: '/some/path', fragment: 'fragment=123'}
        // const didDoc = ...// lookup doc
        // If you need to lookup another did as part of resolving this did document, the primary DIDResolver object is passed in as well
        // const parentDID = await didResolver.resolve(...)
        //
        // return didDoc

        // do {
        //     try {
        //         didDocument = await get(url);
        //     } catch (error) {
        //         err = `DID must resolve to a valid https URL containing a JSON document: ${error}`;
        //         break;
        //     }

        //     // TODO: this excludes the use of query params
        //     const docIdMatchesDid = didDocument?.id === did;

        //     if (!docIdMatchesDid) {
        //         err = 'DID document id does not match requested did'
        //         // break // uncomment this when adding more checks
        //     }
        // } while (false)

        // const contentType =
        //     typeof didDocument?.['@context'] !== 'undefined'
        //         ? 'application/did+ld+json'
        //         : 'application/did+json';

        // if (err) {
        //     return {
        //         didDocument,
        //         didDocumentMetadata,
        //         didResolutionMetadata: {
        //             error: 'notFound',
        //             message: err
        //         }
        //     }
        // } else {
        //     return {
        //         didDocument,
        //         didDocumentMetadata,
        //         didResolutionMetadata: { contentType }
        //     }
        // }
    }

    return { is: resolve };
}
