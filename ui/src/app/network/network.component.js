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
exports.NetworkComponent = void 0;
const core_1 = require("@angular/core");
let NetworkComponent = class NetworkComponent {
    constructor(api, setup, router, activatedRoute) {
        this.api = api;
        this.setup = setup;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.hostClass = true;
        this.subscription = this.setup.currentChain$.subscribe((chain) => __awaiter(this, void 0, void 0, function* () {
            yield this.update();
        }));
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    update() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.info = yield this.api.getInfo();
            this.node = this.info.node;
            this.blockchain = this.node.blockchain;
            this.network = this.node.network;
            this.configuration = this.info.configuration;
            this.consensus = (_a = this.configuration) === null || _a === void 0 ? void 0 : _a.consensus;
            this.peers = yield this.getPeers();
        });
    }
    getPeers() {
        return __awaiter(this, void 0, void 0, function* () {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const list = yield this.api.getPeers(yesterday);
            const uniqueVersions = [...new Set(list.map(peer => peer.subVer))];
            const peerList = uniqueVersions.map(version => {
                const item = {};
                item['version'] = version;
                item['peers'] = list.filter(y => y.subVer === version);
                return item;
            });
            return peerList;
        });
    }
};
__decorate([
    core_1.HostBinding('class.content-centered-top')
], NetworkComponent.prototype, "hostClass", void 0);
NetworkComponent = __decorate([
    core_1.Component({
        selector: 'app-network',
        templateUrl: './network.component.html'
    })
], NetworkComponent);
exports.NetworkComponent = NetworkComponent;
