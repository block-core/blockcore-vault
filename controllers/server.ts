import { addUser } from "../data/users";
import { Handler } from "../types";
import { Vault, IVault } from '../data/models';
import { Server, IServer } from '../data/models';
import { OperationRequest } from "../data/models/operation-request";
import { storeEvent } from "../data/event-store";

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
        console.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const getServer: Handler = async (req, res) => {
    try {
        const item = await Server.findOne({ id: req.params.id });
        res.json(item);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const createServer: Handler = async (req, res) => {
    console.log('Create server...');

    try {
        await storeEvent('create', 'server', req.body);

        // TODO: We should probably do input validation and mapping here? This is now 
        // simply done quick and dirty.
        var vault = new Server(req.body);
        await vault.save();
        res.json({ "success": true });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }
};

export const updateServer: Handler = async (req, res) => {

    try {
        await storeEvent('replace', 'server', req.body);

        var id = req.params.id;

        // TODO: We should probably do input validation and mapping here? This is now 
        // simply done quick and dirty.
        await Server.updateOne({
            id: id
        }, req.body, { upsert: true });
        res.json({ "success": true });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }

    // var query = {'username': req.user.username};
    // req.newData.username = req.user.username;

    // MyModel.findOneAndUpdate(query, req.newData, {upsert: true}, function(err, doc) {
    //     if (err) return res.send(500, {error: err});
    //     return res.send('Succesfully saved.');
    // });

    // await Contact.updateOne({
    //     phone: request.phone
    // }, { status: request.status }, { upsert: true });

    // const doc = await Contact.findOneAndUpdate({
    //     phone: request.phone
    // }, { status: request.status }, { upsert: true, useFindAndModify: false });

    //Vault.f

    // await Contact.updateOne({
    //     phone: request.phone
    // }, { status: request.status }, { upsert: true });



    // var vault = new Vault({ name: "TEST1" });
    // await vault.save();
};

// app.put('url', (req, res) => {

//     const modelId = req.body.model_id;
//     const newName = req.body.name;

//     MyModel.findById(modelId).then((model) => {
//         return Object.assign(model, {name: newName});
//     }).then((model) => {
//         return model.save();
//     }).then((updatedModel) => {
//         res.json({
//             msg: 'model updated',
//             updatedModel
//         });
//     }).catch((err) => {
//         res.send(err);
//     });
// });

export const deleteServer: Handler = async (req, res) => {

    try {
        var id = req.params.id;
        await storeEvent('delete', 'server', { id });

        await Vault.deleteOne({ id: id });
        res.json({ "success": true });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: 400, message: err.message });
    }

};
