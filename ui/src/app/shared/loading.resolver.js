"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingResolverService = void 0;
const core_1 = require("@angular/core");
let LoadingResolverService = class LoadingResolverService {
    constructor(api, setup) {
        this.api = api;
        this.setup = setup;
    }
    resolve(route, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let explorerChain = this.setup.current;
            this.setup.multiChain = true;
            return null;
            // if (!this.setup.initialized) {
            //    try {
            //       this.setup.initialized = true;
            //       // Fetch the configure explorer chain to see if we should run in single or multi-chain mode.
            //       const explorerChainRequest = await this.api.request('/api/explorer/chain');
            //       if (explorerChainRequest.status === 200) {
            //          explorerChain = await explorerChainRequest.text();
            //          this.setup.multiChain = (explorerChain === 'BLOCKCORE');
            //       }
            //    } catch {
            //    }
            // }
            // if (this.setup.multiChain) {
            //    // TODO: Figure out a better way to get path fragments pre-parsed into an array.
            //    const fragments = state.url.split('/');
            //    let chain = fragments[1];
            //    if (!chain) {
            //       chain = 'BLOCKCORE';
            //    }
            //    if (chain.toUpperCase() === 'SETUP') {
            //       return;
            //    }
            //    // If the chain has changed, load again.
            //    if (chain === 'BLOCKCORE' || this.setup.current !== chain) {
            //       return this.setup.setChain(chain);
            //    }
            // } else {
            //    // If the chain has changed, load again.
            //    if (this.setup.current !== explorerChain) {
            //       return this.setup.setChain(explorerChain);
            //    }
            // }
        });
    }
};
LoadingResolverService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], LoadingResolverService);
exports.LoadingResolverService = LoadingResolverService;
