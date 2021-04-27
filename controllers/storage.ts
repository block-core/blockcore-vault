import { addUser } from "../data/users";
import { Handler } from "../types";
import { Vault, IVault } from '../data/models/vault';

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
        console.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const putVault: Handler = async (req, res) => {

    var vaultId = req.params.id;

    var vault = new Vault({ name: "TEST1" });
    await vault.save();

    // Equivalent to `User.updateOne({ email }, { firstName })`
    // const res: any = await User.
    //   find({ email: 'bill@microsoft.com' }).
    //   updateOne({}, { firstName: 'William' });

    // const user: IVault = new Vault({
    //     email: 'bill@microsoft.com',
    //     firstName: 'Bill',
    //     lastName: 'Gates'
    //   });

    //   await user.save();

    console.log(req.body);
    res.send({ 'status': 'ok' });
    // const { username, password } = req.body;

    // console.log(req.body);

    // if (!username?.trim() || !password?.trim()) {
    //     return res.status(400).send("Bad username or password");
    // }

    // addUser({ username, password });

    // res.status(201).send("User created");
};

export const deleteVault: Handler = (req, res) => {
    res.send({
        '@context': 'https://www.w3.org/ns/did/v1',
        'id': 'did:web:dv1.blockcore.net'
    });
};

export const getVault: Handler = async (req, res) => {

    var vaultId = req.params.id;

    // const user: IUser = await User.findOne({ email: 'bill@microsoft.com' });
    // const users: Array<IUser> = await User.find({ email: 'bill@microsoft.com' });

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