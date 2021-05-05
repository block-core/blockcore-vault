import { Handler } from "../types";
import { Server } from '../data/models';

export const wellKnownVaultConfiguration: Handler = async (req, res) => {
    try {
        const item = await Server.findOne({ self: true });

        if (!item) {
            return res.json({ error: 'Vault has not been configured.' });
        }

        return res.send({
            '@context': 'https://w3id.org/encrypted-data-vaults/v1',
            "id": item.id,
            "name": item.name,
            "dataVaultCreationService": item.url
        });

    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const wellKnownDid: Handler = async (req, res) => {
    try {
        const item = await Server.findOne({ self: true });

        if (!item) {
            return res.json({ error: 'Vault has not been configured.' });
        }

        return res.send({
            '@context': 'https://www.w3.org/ns/did/v1',
            'id': item.id
        });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const wellKnownDidConfiguration: Handler = async (req, res) => {
    try {
        const item = await Server.findOne({ self: true });

        if (!item) {
            return res.json({ error: 'Vault has not been configured.' });
        }

        return res.send({
            '@context': 'https://identity.foundation/.well-known/did-configuration/v1',
            'linked_dids': item.linked_dids
        });

    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};
