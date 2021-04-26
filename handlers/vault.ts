import { addUser } from "../data/users";
import { Handler } from "../types";

export const putVault: Handler = (req, res) => {
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

export const getVault: Handler = (req, res) => {
    res.send({
        '@context': 'https://identity.foundation/.well-known/did-configuration/v1',
        'linked_dids': []
    });
};

