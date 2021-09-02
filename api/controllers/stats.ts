import { Handler } from "../types";
import { Vault, IVault } from '../data/models';
import { Server, IServer } from '../data/models';
import { OperationRequest } from "../data/models/operation-request";
import { storeEvent } from "../data/event-store";
import { log } from '../services/logger';
import PubSub from 'pubsub-js';
import { totalEvents } from "./event";
import { Identity } from "../data/models/identity";

/**
 * @swagger
 * /management/statistics:
 *   get:
 *     summary: Get statistics for the Admin UI dashboard
 *     tags: [Vault]
 */
export const getStatistics: Handler = async (req, res) => {

    try {
        const servers = await Server.countDocuments();
        const operations = await OperationRequest.countDocuments();
        const identities = await Identity.find({ sequence: 0 }).countDocuments();

        res.json({
            servers: servers,
            operations: operations,
            identities: identities
        });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};
