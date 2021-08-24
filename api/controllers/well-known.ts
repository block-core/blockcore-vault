import { Handler } from "../types";
import { Server } from '../data/models';
import { log } from '../services/logger';

/**
 * @swagger
 * /.well-known/vault-configuration.json:
 *   get:
 *     summary: Get Vault Configuration
 *     tags: [Discovery]
 *     security: []
 *     responses:
 *       200:
 *         description: The configuration of the Vault.
 */
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
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /.well-known/did.json:
 *   get:
 *     summary: Get DID Subject from the .well-known DID resource URI.
 *     tags: [Discovery]
 *     security: []
 *     responses:
 *       200:
 *         description: The DID Subject.
 */
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
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /.well-known/did-configuration.json:
 *   get:
 *     summary: Get DID Configuration .well-known resource URI.
 *     tags: [Discovery]
 *     security: []
 *     responses:
 *       200:
 *         description: The DID Configuration.
 */
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
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};
