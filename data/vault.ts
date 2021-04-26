// // import { Vault } from "../types";
// import { Vault, IVault } from './models/vault';

// const mongoose = require('mongoose');

// const vaults: Vault[] = [];

// export const addVault = (vault: IVault) => {

// // VaultModel.where

// //     var model = new VaultModel();
// //     model.save();


// //     vaults.push(vault);
// // };

// const post = new VaultModel({
//     name: 'Hi'
// });

// // await post.save();

// // res.send(post);


// export const getVault = (vault: Vault) => {
//     return vaults.find(
//         (v) => v.name === vault.name
//     );
// };

// var vaultSchema = new mongoose.Schema({
//     id: String, 
//     enabled: Boolean, 
//     name: { type: [String], index: true },
//     description: String, 
//     url: String, 
//     created: Date,
//     modified: Date, 
//     lastSeen: Date, 
//     lastFullSync: Date,
//     wellKnownConfiguration: String, 
//     state: String
// });

// // vaultSchema.index({ name: 1, type: -1 }); // schema level

// var User = mongoose.model("Vault", vaultSchema);
// export type User


