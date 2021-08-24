import { Handler } from "../types";
import { log } from '../services/logger';
import { Vault, IVault } from '../data/models/vault';

export const getVaults: Handler = async (req, res) => {

    // destructure page and limit and set default values
    const { page = 1, limit = 10 } = req.query;
    var pageNumber = page as number;
    var limitNumber = limit as number;

    if (limitNumber > 100)
    {
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
        log.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

/**
 * @swagger
 * /vault/{id}:
 *   put:
 *     summary: Updates Vault by id
 *     tags: [Identity]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: vault id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         decsription: The Vault was updated
 *
 */
export const putVault: Handler = async (req, res) => {

    var vaultId = req.params.id;

    var vault = new Vault({ name: "TEST1" });
    await vault.save();

    log.info(req.body);
    res.send({ 'status': 'ok' });
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

