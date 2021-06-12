// var UserService = require('../services/user.service')

// import { VaultService } from '../services/vault';

// exports.getUsers = async function (req, res, next) {
//     // Validate request parameters, queries using express-validator

//     var page = req.params.page ? req.params.page : 1;
//     var limit = req.params.limit ? req.params.limit : 10;
//     try {
//         var users = await UserService.getUsers({}, page, limit)
//         return res.status(200).json({ status: 200, data: users, message: "Succesfully Users Retrieved" });
//     } catch (e) {
//         return res.status(400).json({ status: 400, message: e.message });
//     }
// }

import { Handler } from "../types";
import { log } from '../services/logger';

// import Vault = require("../data/models");
// import Vault = require("../data/models/vault");

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

    // const page = parseInt(req.query.page, 10) || 1; // getting the 'page' value
    // const limit = parseInt(req.query.limit, 10) || 25; // getting the 'limit' value
    // const startIndex = (page - 1) * limit; // this is how we would calculate the start index aka the SKIP value
    // const endIndex = page * limit; // this is how we would calculate the end index

    // var limit = parseInt(req.query.limit);
    // var skip = (parseInt(body.page)-1) * parseInt(limit);

    // const pageOptions = {
    //     page: parseInt(req.query.page, 10) || 0,
    //     limit: parseInt(req.query.limit, 10) || 10
    // }

    // var page = req.params.page ? req.params.page as unknown as number : 1;
    // var limit = req.params.limit ? req.params.limit as unknown as number : 10;

    // const user: IUser = await User.findOne({ email: 'bill@microsoft.com' });
    // const users: Array<IUser> = await User.find({ email: 'bill@microsoft.com' });

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

    // try {
    //     var users = await VaultService.getUsers({}, page, limit)
    //     return res.status(200).json({ status: 200, data: users, message: "Succesfully Users Retrieved" });
    // } catch (e) {
    //     return res.status(400).json({ status: 400, message: e.message });
    // }
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

    log.info(req.body);
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

