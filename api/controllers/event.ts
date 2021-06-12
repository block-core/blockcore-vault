import { Handler } from "../types";
import { Vault, IVault } from '../data/models';
import { Server, IServer } from '../data/models';
import { OperationRequest } from "../data/models/operation-request";
import { storeEvent } from "../data/event-store";
import { log } from '../services/logger';
import PubSub from 'pubsub-js';

/** Returns the total amount of registered events (operations). This value will might be cached. */
export const totalEvents: Handler = async (req, res) => {
    try {
        // TODO: Implement some sort of caching mechanism, as this will be used in an API call for all connected vaults to know if they have received
        // all the documents.
        const count = await OperationRequest.countDocuments();
        return res.json({ count: count });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/** Returns the total latest event */
export const latestEvent: Handler = async (req, res) => {
    try {
        // TODO: Implement some sort of caching mechanism, as this will be used in an API call for all connected vaults to know if they have received
        // all the documents.
        const latest = await OperationRequest.findOne({}, null, { sort: { sequence: -1 } });
        return res.json(latest);
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const getEvents: Handler = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    var pageNumber = page as number; // TODO: Figure out a better way to ensure casting to number for this?
    var limitNumber = limit as number;

    if (limitNumber > 100) {
        res.status(500).json({ status: 500, message: 'The limit can be maxium 100.' });
    }

    try {
        const data = await OperationRequest.find()
            .limit(limitNumber * 1)
            .skip((pageNumber - 1) * limitNumber)
            .exec();

        const count = await OperationRequest.countDocuments();

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

export const getServer: Handler = async (req, res) => {
    try {
        const item = await OperationRequest.findOne({ id: req.params.id });
        res.json(item);
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

// export const createServer: Handler = async (req, res) => {
//     log.info('Create server...');

//     try {
//         // await storeEvent('create', 'server', req.body);

//         // TODO: We should probably do input validation and mapping here? This is now 
//         // simply done quick and dirty.

//         // Set the current time as created.
//         // req.body.created = new Date();

//         // Make sure we can't create multiple self entries using this API.
//         delete req.body.self;

//         var vault = new OperationRequest(req.body);
//         var saved = await vault.save();

//         PubSub.publish('server-created', saved);

//         res.json({ "success": true });
//     } catch (err) {
//         log.error(err.message);
//         return res.status(400).json({ status: 400, message: err.message });
//     }
// };

// export const updateServer: Handler = async (req, res) => {
//     try {
//         // await storeEvent('replace', 'server', req.body);
//         var id = req.params.id;

//         // Set the update time right now.
//         // req.body.updated = new Date();

//         // Make sure we can't create multiple self entries using this API.
//         delete req.body.self;

//         // TODO: We should probably do input validation and mapping here? This is now 
//         // simply done quick and dirty.
//         var saved = await Server.updateOne({
//             id: id
//         }, req.body, { upsert: true });

//         PubSub.publish('server-replaced', saved);

//         res.json({ "success": true });
//     } catch (err) {
//         log.error(err.message);
//         return res.status(400).json({ status: 400, message: err.message });
//     }
// };

// export const deleteServer: Handler = async (req, res) => {
//     try {
//         var id = req.params.id;
//         await storeEvent('delete', 'server', { id });

//         await Vault.deleteOne({ id: id });
//         res.json({ "success": true });
//     } catch (err) {
//         log.error(err.message);
//         return res.status(400).json({ status: 400, message: err.message });
//     }
// };

// export const getEvent: Handler = async (req, res) => {
//     try {
//         const item = await OperationRequest.findOne({ id: req.params.id });
//         res.json(item);
//     } catch (err) {
//         log.error(err.message);
//         return res.status(400).json({ status: 400, message: err.message });
//     }
// };

// export const updateLocalServer: Handler = async (req, res) => {
//     try {
//         log.info('UPDATE LOCAL SERVER!');

//         // if (!req.body.created) {
//         //     req.body.created = new Date();
//         // }

//         // Set the update time right now.
//         // req.body.updated = new Date();

//         // Force the self to always be true on this entity.
//         req.body.self = true;

//         await Server.updateOne({
//             self: true
//         }, req.body, { upsert: true });
//         res.json({ "success": true });
//     } catch (err) {
//         log.error(err.message);
//         return res.status(400).json({ status: 400, message: err.message });
//     }
// };
