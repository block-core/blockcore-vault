"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import HttpProvider from 'ethjs-provider-http'
// import Eth from 'ethjs-query'
// import EthContract from 'ethjs-contract'
// import DidRegistryContract from 'ethr-did-resolver/contracts/ethr-did-registry.json'
const did_jwt_1 = require("did-jwt");
class BlockcoreDID {
    //   private owner?: string
    constructor(conf) {
        console.log(conf);
        //  const provider = this.configureProvider(conf)
        //  const eth = new Eth(provider)
        //  const registryAddress = conf.registry || REGISTRY
        //  const DidReg = new EthContract(eth)(DidRegistryContract)
        //  this.registry = DidReg.at(registryAddress)
        this.address = conf.address;
        //  if (!this.address) throw new Error('No address is set for EthrDid')
        this.did = `did:is:${this.address}`;
        //  if (conf.signer) {
        //    this.signer = conf.signer
        //  } else if (conf.privateKey) {
        this.signer = did_jwt_1.SimpleSigner(conf.privateKey);
        //  }
    }
}
exports.default = BlockcoreDID;
