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
exports.SearchComponent = void 0;
const core_1 = require("@angular/core");
let SearchComponent = class SearchComponent {
    constructor(api, setup, router) {
        this.api = api;
        this.setup = setup;
        this.router = router;
    }
    ngOnDestroy() {
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    inputType(value) {
        // LONG_MAX: 9223372036854775807
        if (value.length < 20) {
            return 'index';
        }
        else if (value.length > 30 && value.length < 54) {
            return 'address';
        }
        else {
            return 'hash';
        }
    }
    search() {
        return __awaiter(this, void 0, void 0, function* () {
            const text = this.searchTerm;
            console.log('search for:' + text);
            const inputType = this.inputType(text);
            switch (inputType) {
                case 'index': {
                    // tslint:disable-next-line: radix
                    const index = parseInt(text);
                    if (index !== NaN && index > 0) {
                        this.router.navigate([this.setup.current, 'explorer', 'block', index]);
                    }
                    break;
                }
                case 'address': {
                    this.router.navigate([this.setup.current, 'explorer', 'address', text]);
                    break;
                }
                case 'hash': {
                    // Search first for block then if not found, search for transaction.
                    let block = null;
                    // TODO: An important todo is to put the search results from here into state-management!
                    //       That way, we will avoid loading the transaction/block twice when searching.
                    try {
                        block = yield this.api.getBlockByHash(text);
                    }
                    catch (err) {
                        // We could check if this is actually an 404 or some other error. Should we?
                    }
                    if (block) {
                        this.router.navigate([this.setup.current, 'explorer', 'block', block.blockHash]);
                    }
                    else {
                        const transaction = yield this.api.getTransaction(text);
                        this.router.navigate([this.setup.current, 'explorer', 'transaction', transaction.transactionId]);
                    }
                    break;
                }
            }
        });
    }
};
SearchComponent = __decorate([
    core_1.Component({
        selector: 'app-search',
        templateUrl: './search.component.html',
    })
], SearchComponent);
exports.SearchComponent = SearchComponent;
