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
exports.TransactionComponent = void 0;
const core_1 = require("@angular/core");
let TransactionComponent = class TransactionComponent {
    constructor(api, router, setup, activatedRoute) {
        this.api = api;
        this.router = router;
        this.setup = setup;
        this.activatedRoute = activatedRoute;
        this.hostClass = true;
        this.detailsVisible = false;
        this.activatedRoute.paramMap.subscribe((params) => __awaiter(this, void 0, void 0, function* () {
            const id = params.get('transaction');
            console.log('Transaction ID:', id);
            try {
                this.transaction = yield this.api.getTransaction(id);
                this.error = null;
            }
            catch (e) {
                this.error = e;
            }
            console.log(this.transaction);
        }));
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    toggleDetails() {
        this.detailsVisible = !this.detailsVisible;
    }
    ngOnDestroy() {
    }
};
__decorate([
    core_1.HostBinding('class.content-centered-top')
], TransactionComponent.prototype, "hostClass", void 0);
TransactionComponent = __decorate([
    core_1.Component({
        selector: 'app-transaction-component',
        templateUrl: './transaction.component.html'
    })
], TransactionComponent);
exports.TransactionComponent = TransactionComponent;
