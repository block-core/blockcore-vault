import { addUser } from "../data/users";
import { Handler } from "../types";

export const wellKnownVaultConfiguration: Handler = (req, res) => {
    // const { username, password } = req.body;

    // console.log(req.body);

    // if (!username?.trim() || !password?.trim()) {
    //     return res.status(400).send("Bad username or password");
    // }

    // addUser({ username, password });

    // res.status(201).send("User created");

    res.send({
        "id": "https://example.com/edvs/z4sRgBJJLnYy",
        "sequence": 0,
        "controller": "did:example:123456789",
        "referenceId": "my-primary-data-vault",
        "keyAgreementKey": {
            "id": "https://example.com/kms/12345",
            "type": "X25519KeyAgreementKey2019"
        },
        "hmac": {
            "id": "https://example.com/kms/67891",
            "type": "Sha256HmacKey2019"
        }
    });

};

export const wellKnownDid: Handler = (req, res) => {
    res.send({
        '@context': 'https://www.w3.org/ns/did/v1',
        'id': 'did:web:dv1.blockcore.net'
    });
};

export const wellKnownDidConfiguration: Handler = (req, res) => {
    res.send({
        '@context': 'https://identity.foundation/.well-known/did-configuration/v1',
        'linked_dids': []
    });
};

