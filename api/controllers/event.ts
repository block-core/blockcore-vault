import { Handler } from "../types";
import { OperationRequest } from "../data/models/operation-request";
import { log } from '../services/logger';

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

/** Returns a unique event */
export const getEvent: Handler = async (req, res) => {
    try {
        // TODO: Implement some sort of caching mechanism
        const item = await OperationRequest.findOne({ id: req.params.id, type: req.params.type, operation: req.params.operation, sequence: req.params.sequence });

        if (item) {
            return res.json(item);
        } else {
            return res.sendStatus(404);
        }
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