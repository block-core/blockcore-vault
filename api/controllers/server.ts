import { Handler } from "../types";
import { Vault, IVault } from '../data/models';
import { Server, IServer } from '../data/models';
import { storeEvent } from "../data/event-store";
import { log } from '../services/logger';
import PubSub from 'pubsub-js';
import { Setting } from "../data/models/setting";
import { state } from '../services/vault-state';

/**
 * @swagger
 * /management/server:
 *   get:
 *     summary: Get the registered Blockcore Vault instances.
 *     tags: [Management]
 *     responses:
 *       200:
 *         description: List of servers.
 */
export const getServers: Handler = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    var pageNumber = page as number; // TODO: Figure out a better way to ensure casting to number for this?
    var limitNumber = limit as number;

    if (limitNumber > 100) {
        res.status(500).json({ status: 500, message: 'The limit can be maxium 100.' });
    }

    try {
        const data = await Server.find()
            .limit(limitNumber * 1)
            .skip((pageNumber - 1) * limitNumber)
            .exec();

        const count = await Server.countDocuments();

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

/**
 * @swagger
 * /management/server/{id}:
 *   get:
 *     summary: Get a specific Blockcore Vault instance.
 *     tags: [Management]
  *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the server
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Details about a single server.
 *       404:
 *         description: The server does not exists.
 *       401:
 *         description: Unauthorized, check your API key.
 */
export const getServer: Handler = async (req, res) => {
    try {
        const item = await Server.findOne({ id: req.params.id });
        res.json(item);
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /management/setting:
 *   get:
 *     summary: Get the settings for the current Vault instance.
 *     tags: [Management]
 *     responses:
 *       200:
 *         description: Current active settings.
 */
export const getSettings: Handler = async (req, res) => {
    try {
        const item = await Setting.findOne({ id: '1' });
        res.json(item);
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /management/setting:
 *   post:
 *     summary: Update the current Vault instance settings.
 *     tags: [Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */
export const updateSettings: Handler = async (req, res) => {

    try {
        var id = '1';

        // Set the update time right now.
        // req.body.updated = new Date();

        // Make sure we can't create multiple self entries using this API.
        delete req.body.self;

        var server = req.body;

        // TODO: We should probably do input validation and mapping here? This is now 
        // simply done quick and dirty.
        var previous = await Setting.findOneAndUpdate({
            id: id
        }, server, { upsert: true });

        log.info('The previous server: ' + JSON.stringify(previous));
        log.info('The saved server: ' + JSON.stringify(server));

        PubSub.publish('server-replaced', server);

        // Make sure we update the API key:
        state.apiKey = server.apiKey;

        res.json({ "success": true });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /management/server:
 *   post:
 *     summary: Save a new server.
 *     tags: [Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         decsription: The post was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: post was not found.
 *       500:
 *         description: Some errors happend.
 *
 */
export const createServer: Handler = async (req, res) => {
    log.info('Create server...');

    try {
        // await storeEvent('create', 'server', req.body);

        // TODO: We should probably do input validation and mapping here? This is now 
        // simply done quick and dirty.

        // Set the current time as created.
        // req.body.created = new Date();

        // Make sure we can't create multiple self entries using this API.
        delete req.body.self;

        var vault = new Server(req.body);
        var saved = await vault.save();

        PubSub.publish('server-created', saved);

        res.json({ "success": true });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /management/server:
 *   put:
 *     summary: Update a specific server.
 *     tags: [Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         decsription: The post was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: post was not found.
 *       500:
 *         description: Some errors happend.
 *
 */
export const updateServer: Handler = async (req, res) => {

    try {
        // await storeEvent('replace', 'server', req.body);
        var id = req.params.id;

        // Set the update time right now.
        // req.body.updated = new Date();

        // Make sure we can't create multiple self entries using this API.
        delete req.body.self;

        // TODO: We should probably do input validation and mapping here? This is now 
        // simply done quick and dirty.
        var saved = await Server.findOneAndUpdate({
            id: id
        }, req.body, { upsert: true });

        log.info('The saved server: ' + JSON.stringify(saved));

        PubSub.publish('server-replaced', saved);

        res.json({ "success": true });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 *  /management/server/{id}:
 *    delete:
 *      summary: Removes a server registered on this Vault instance.
 *      tags: [Management]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: post id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The server was deleted
 *        404:
 *          description: The server was not found
 *
 */
export const deleteServer: Handler = async (req, res) => {
    try {
        var id = req.params.id;
        // await storeEvent('delete', 'server', { id });

        await Server.deleteOne({ id: id });
        res.json({ "success": true });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const getLocalServer: Handler = async (req, res) => {
    try {
        const item = await Server.findOne({ self: true });

        if (!item) {
            return res.json({ "error": "This vault instance has not yet been configured." });
        }

        return res.json(item);
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const updateLocalServer: Handler = async (req, res) => {
    try {
        // Set the update time right now.
        // req.body.updated = new Date();

        // Force the self to always be true on this entity.
        req.body.self = true;

        await Server.updateOne({
            self: true
        }, req.body, { upsert: true });

        res.json({ "success": true });
    } catch (err) {
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};
