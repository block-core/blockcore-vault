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
exports.SetupService = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
let SetupService = class SetupService {
    constructor(http, api, router) {
        this.http = http;
        this.api = api;
        this.router = router;
        this.initialized = false;
        this.setupComplete = false;
        // Both SubjectBehavior and Behavior, depending on consumer.
        // The "currentChainSubject$" will return current value as soon as subscribed.
        this.currentChainSubjectBehavior = new rxjs_1.BehaviorSubject('BLOCKCORE');
        // private readonly currentChainSubject = new Subject<string>();
        // readonly currentChainSubjectBehavior$ = this.currentChainSubjectBehavior.asObservable();
        // readonly currentChainBehavior$ = this.currentChainBehavior.asObservable();
        this.currentChain$ = this.currentChainSubjectBehavior.asObservable();
    }
    get current() {
        return this.currentChainSubjectBehavior.getValue();
    }
    set current(val) {
        this.currentChainSubjectBehavior.next(val);
    }
    getChains() {
        return __awaiter(this, void 0, void 0, function* () {
            // const data = await this.api.loadSetups();
            // this.chains = data;
            // console.log('CHAINS:', this.chains);
        });
    }
    // Important that this is async and we wait for continued processing,
    // as we must have the chain setup as early as possible.
    setChain(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (chain !== 'BLOCKCORE' && this.current === chain) {
            //    console.log('CURRENT CHAIN IS SAME!');
            //    // Update the chain subject, which should trigger consumers to do some processing.
            //    this.current = chain;
            //    return;
            // }
            // // Make sure we have downloaded the setup before we trigger change.
            // const data = await this.api.loadSetup(chain);
            // this.data = data;
            // this.Chain = this.data.Chain;
            // this.Network = this.data.Network;
            // this.Indexer = this.data.Indexer;
            // this.Explorer = this.data.Explorer;
            // // Update the chain subject, which should trigger consumers to do some processing.
            // this.current = chain;
            // console.log(this.Chain);
            // if (this.Chain?.Color) {
            //    document.documentElement.style.setProperty('--accent', this.Chain?.Color);
            // }
            return null;
        });
    }
    featureEnabled(feature) {
        // If feature is something and it is explicit set to false, hide.
        if (feature === false) {
            return false;
        }
        else {
            return true;
        }
    }
};
SetupService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], SetupService);
exports.SetupService = SetupService;
