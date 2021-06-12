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
exports.TickerComponent = void 0;
const core_1 = require("@angular/core");
let TickerComponent = class TickerComponent {
    constructor(api, setup, router) {
        this.api = api;
        this.setup = setup;
        this.router = router;
        this.hostClass = true;
        this.ticker = {};
        this.navigator = (obj, path) => path.split('.').reduce((a, b) => a && a[b], obj);
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    updateTicker() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.error = null;
                const url = (_b = (_a = this.setup.Explorer) === null || _a === void 0 ? void 0 : _a.Ticker) === null || _b === void 0 ? void 0 : _b.ApiUrl;
                if (!url) {
                    this.ticker = {};
                    return;
                }
                const request = yield this.api.download(url);
                const changePercentage = this.navigator(request, this.setup.Explorer.Ticker.PercentagePath);
                let changeType = 'neutral';
                if (changePercentage < 0) {
                    changeType = 'negative';
                }
                if (changePercentage > 0) {
                    changeType = 'positive';
                }
                this.ticker = {
                    btc: this.navigator(request, this.setup.Explorer.Ticker.PricePathBTC),
                    usd: this.navigator(request, this.setup.Explorer.Ticker.PricePathUSD),
                    changePercentage,
                    changeType
                };
            }
            catch (err) {
                this.ticker = { btc: null, usd: null, changePercentage: null, changeType: null };
                this.error = err;
            }
        });
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.subscription = this.setup.currentChain$.subscribe((chain) => __awaiter(this, void 0, void 0, function* () {
                yield this.updateTicker();
            }));
        });
    }
};
__decorate([
    core_1.HostBinding('class.content-centered')
], TickerComponent.prototype, "hostClass", void 0);
TickerComponent = __decorate([
    core_1.Component({
        selector: 'app-ticker',
        templateUrl: './ticker.component.html',
    })
], TickerComponent);
exports.TickerComponent = TickerComponent;
