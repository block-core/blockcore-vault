"use strict";
// Based on Decentralized Identifiers (DIDs) v1.0
// W3C Working Draft 26 January 2021
// https://w3c.github.io/did-core/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockcoreIdentity = exports.BlockcoreIdentityIssuer = exports.BlockcoreResolver = exports.BlockcoreIdentityResolver = void 0;
// import base64url from 'base64url'; // Should we replicate this code to avoid dependency? It's a very simple utility.
// import utf8 from 'utf8';
// import didJWT from 'did-jwt';
const didJWT = __importStar(require("did-jwt"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
// const didJWT = require('did-jwt');
class BlockcoreIdentityResolver {
}
exports.BlockcoreIdentityResolver = BlockcoreIdentityResolver;
class BlockcoreResolver {
    getResolver() {
        function get(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield cross_fetch_1.default(url, { mode: 'cors' });
                if (res.status >= 400) {
                    throw new Error(`Bad response ${res.statusText}`);
                }
                return res.json();
            });
        }
        function resolve(did, parsed, didResolver) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(parsed);
                const url = `https://www.did.is/api/identity/${parsed.id}`;
                console.log(url);
                let data = null;
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
                data = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE2MTE3OTIyOTAsIkBjb250ZXh0IjoiaHR0cHM6Ly93d3cudzMub3JnL25zL2RpZC92MSIsImlkIjoiZGlkOmlzOlBUY243N3dacmh1Z3lyeFg4QXdaeHk0eG1tcWJDdlpjS3UiLCJ2ZXJpZmljYXRpb25NZXRob2QiOlt7ImlkIjoiZGlkOmlzOlBUY243N3dacmh1Z3lyeFg4QXdaeHk0eG1tcWJDdlpjS3Uja2V5LTEiLCJ0eXBlIjoiRWNkc2FTZWNwMjU2azFWZXJpZmljYXRpb25LZXkyMDE5IiwiY29udHJvbGxlciI6ImRpZDppczpQVGNuNzd3WnJodWd5cnhYOEF3Wnh5NHhtbXFiQ3ZaY0t1IiwicHVibGljS2V5SGV4IjoiMDJEQUQ2M0E1OTFFNjlCMTlEOEREMEU0NEM1Rjk2ODNFQjgwRjI2ODRFQzhFRDg4RTI1OUFBNTZDNzE3MjZCNDdEIn1dLCJzZXJ2aWNlIjpbeyJpZCI6ImRpZDppczpQVGNuNzd3WnJodWd5cnhYOEF3Wnh5NHhtbXFiQ3ZaY0t1I2NpdHkiLCJ0eXBlIjoiUGF5bWVudCIsInNlcnZpY2VFbmRwb2ludCI6ImNpdHk6Q1dkZGVjRFZoM3ZyeE1wc2hEaUFCSmVBOThYeFdyOXkxdCJ9LHsiaWQiOiJkaWQ6aXM6UFRjbjc3d1pyaHVneXJ4WDhBd1p4eTR4bW1xYkN2WmNLdSNlZHYiLCJ0eXBlIjoiRW5jcnlwdGVkRGF0YVZhdWx0Iiwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly92YXVsdC5ibG9ja2NvcmUubmV0LyJ9LHsiaWQiOiJkaWQ6aXM6UFRjbjc3d1pyaHVneXJ4WDhBd1p4eTR4bW1xYkN2WmNLdSNzdGFtcCIsInR5cGUiOiJTdGFtcCIsInNlcnZpY2VFbmRwb2ludCI6ImVjYXNoOnFwMHJkd3YybnpyODRydTA1NGd2cXpybG5wbHR4YWE2c3FqZmw4NmMyZiIsImRlc2NyaXB0aW9uIjoiTXkgcHVibGljIHNvY2lhbCBpbmJveCIsInNwYW1Db3N0Ijp7ImFtb3VudCI6IjAuMDAwMTAwIiwiY3VycmVuY3kiOiJlY2FzaCJ9fV0sImlzcyI6ImRpZDppczpQVGNuNzd3WnJodWd5cnhYOEF3Wnh5NHhtbXFiQ3ZaY0t1In0.ItCVR8FQBDS7GPB9_QE0jCt8Afkp4L9eHfGF1uxBdS2DyCJudm7-de-r4_CRUJ-hHfSh1ppc8Kd8QSNUdfe7FQ';
                return data;
                // {method: 'mymethod', id: 'abcdefg', did: 'did:mymethod:abcdefg/some/path#fragment=123', path: '/some/path', fragment: 'fragment=123'}
                // const didDoc = ...// lookup doc
                // If you need to lookup another did as part of resolving this did document, the primary DIDResolver object is passed in as well
                // const parentDID = await didResolver.resolve(...)
                //
                // return didDoc
            });
        }
        return { is: resolve };
    }
}
exports.BlockcoreResolver = BlockcoreResolver;
class BlockcoreIdentityIssuer {
}
exports.BlockcoreIdentityIssuer = BlockcoreIdentityIssuer;
class BlockcoreIdentity {
    constructor(address, privateKey) {
        this.id = 'did:is:' + address;
        console.log(privateKey.substring(0, 2));
        if (privateKey.substring(0, 2) != '0x') {
            privateKey += '0x';
        }
        this.privateKey = privateKey;
    }
    ordered(a, b) {
        let comparison = 0;
        if (a.id > b.id) {
            comparison = 1;
        }
        else if (a.id < b.id) {
            comparison = -1;
        }
        return comparison;
    }
    jwt() {
        return __awaiter(this, void 0, void 0, function* () {
            // const signer = didJWT.SimpleSigner(this.privateKey);
            const signer = didJWT.ES256KSigner(this.privateKey);
            // const signer = didJWT.SimpleSigner('278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f');
            let jwt = yield didJWT.createJWT(this.document(), { alg: 'ES256K', issuer: this.id, signer });
            // var jwt = this.encodeJwt(this.document());
            return jwt;
        });
    }
    // private encodeJwt(payload: string | any) {
    //    let payloadText;
    //    if (typeof payload === 'string' || payload instanceof String) {
    //       payloadText = payload;
    //    }
    //    else {
    //       payloadText = JSON.stringify(payload);
    //    }
    //    // const publicKey = this.getAddress(identity, this.identityNetwork);
    //    const header = {
    //       alg: 'ES256K', // We currently only support ES256K.
    //       typ: 'JWT',
    //       kid: this.id
    //    };
    //    const headerText = JSON.stringify(header);
    //    // Header is first encoded to UTF-8 then base64url encoded, while payload is encoded directly to base64url. This is according to the specification.
    //    let message = base64url.encode(utf8.encode(headerText)) + '.' + base64url.encode(payloadText);
    //    const signature = blockcoreMessage.sign(message, this.privateKey, true, '');
    //    message += '.' + base64url.encode(signature);
    //    return message;
    // }
    //    let jwt = await didJWT.createJWT({aud: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', exp: 1957463421, name: 'uPort Developer'},
    //                  {alg: 'ES256K', issuer: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', signer})
    // console.log(jwt);
    /** Generates the self-managed DID document for the current identity. */
    document() {
        const data = {};
        data['@context'] = 'https://www.w3.org/ns/did/v1';
        data.id = this.id;
        data.verificationMethod = [{
                "id": this.id + "#key-1",
                "type": "EcdsaSecp256k1VerificationKey2019",
                "controller": this.id,
                "publicKeyHex": "02DAD63A591E69B19D8DD0E44C5F9683EB80F2684EC8ED88E259AA56C71726B47D"
            }].sort(this.ordered);
        // Should be ordered, probably sorted by ID.
        data.service = [
            {
                "id": this.id + "#edv",
                "type": "EncryptedDataVault",
                "serviceEndpoint": "https://vault.blockcore.net/"
            },
            {
                "id": this.id + "#city",
                "type": "Payment",
                "serviceEndpoint": "city:CWddecDVh3vrxMpshDiABJeA98XxWr9y1t"
            },
            {
                "id": this.id + "#stamp",
                "type": "Stamp",
                "serviceEndpoint": "ecash:qp0rdwv2nzr84ru054gvqzrlnpltxaa6sqjfl86c2f",
                "description": "My public social inbox",
                "spamCost": {
                    "amount": "0.000100",
                    "currency": "ecash"
                }
            }
        ].sort(this.ordered);
        // Should be ordered, probably sorted by ID.
        // data.publicKey = [{
        //    "id": "did:example:123#vm-3",
        //    "controller": "did:example:123",
        //    "type": "EcdsaSecp256k1RecoveryMethod2020",
        //    "ethereumAddress": "0xF3beAC30C498D9E26865F34fCAa57dBB935b0D74"
        //  }];
        return data;
    }
    /** Generates the self-managed DID document for the current identity. */
    document2(name, description) {
        const data = {};
        data['@context'] = 'https://www.w3.org/ns/did/v1';
        data.id = this.id;
        data.verificationMethod = [{
                "id": this.id + "#key-1",
                "type": "EcdsaSecp256k1VerificationKey2019",
                "controller": this.id,
                "publicKeyHex": "02DAD63A591E69B19D8DD0E44C5F9683EB80F2684EC8ED88E259AA56C71726B47D"
            }].sort(this.ordered);
        // Should be ordered, probably sorted by ID.
        data.service = [
            {
                "id": this.id + "#edv",
                "type": "EncryptedDataVault",
                "serviceEndpoint": "https://vault.blockcore.net/",
                "name": name,
                "description": description
            }
        ].sort(this.ordered);
        // Should be ordered, probably sorted by ID.
        // data.publicKey = [{
        //    "id": "did:example:123#vm-3",
        //    "controller": "did:example:123",
        //    "type": "EcdsaSecp256k1RecoveryMethod2020",
        //    "ethereumAddress": "0xF3beAC30C498D9E26865F34fCAa57dBB935b0D74"
        //  }];
        return data;
    }
    /** Generates a well known configuration for DID resolver host. */
    wellKnownConfiguration(domain) {
        const date = new Date();
        const expiredate = new Date(new Date().setFullYear(date.getFullYear() + 100));
        const data = {};
        data['@context'] = 'https://' + domain + '/.well-known/did-configuration/v1';
        data.linked_dids = [
            {
                "issuanceDate": date.toISOString(),
                "expirationDate": expiredate.toISOString(),
                "credentialSubject": {
                    "id": this.id,
                    "origin": "https://" + domain
                },
            }
        ];
        return data;
    }
}
exports.BlockcoreIdentity = BlockcoreIdentity;
