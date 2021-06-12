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
exports.ApiService = exports.HttpError = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
class HttpError extends Error {
    constructor(code, url, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = HttpError.name;
        this.url = url;
        this.code = code;
    }
}
exports.HttpError = HttpError;
// export class NotFoundError extends HttpError {
//    constructor(message?: string) {
//       super(404, message);
//       Object.setPrototypeOf(this, new.target.prototype);
//       this.name = NotFoundError.name;
//    }
// }
let ApiService = class ApiService {
    constructor(http, appState) {
        this.http = http;
        this.appState = appState;
    }
    createAuthorizationHeader(headers) {
        if (!headers) {
            headers = new http_1.HttpHeaders();
        }
        headers = headers.append('Vault-Api-Key', this.appState.apiKey);
        console.log(headers);
        return headers;
    }
    get(url) {
        return this.http.get(url, {
            headers: this.createAuthorizationHeader()
        });
    }
    post(url, data) {
        return this.http.post(url, data, {
            headers: this.createAuthorizationHeader()
        });
    }
    put(url, data) {
        return this.http.put(url, data, {
            headers: this.createAuthorizationHeader()
        });
    }
    delete(url) {
        return this.http.delete(url, {
            headers: this.createAuthorizationHeader()
        });
    }
    download(url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('DOWNLOADING:', url);
            const response = yield fetch(url, options);
            const json = yield response.json();
            if (response.status !== 200) {
                if (json && json.status) {
                    throw new HttpError(json.status, url, json.title);
                }
                else {
                    throw new HttpError(response.status, url, response.statusText);
                }
            }
            console.log('DOWNLOADED:', url);
            return json;
        });
    }
    downloadRelative(path, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.download(this.baseUrl + path, options);
        });
    }
    request(url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('DOWNLOADING:', url);
            const response = yield fetch(url, options);
            return response;
        });
    }
    requestRelative(path, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('DOWNLOADING:', this.baseUrl + path);
            const response = yield fetch(this.baseUrl + path, options);
            return response;
        });
    }
    loadSetup(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const setup = yield this.download('https://chains.blockcore.net/chains/' + chain.toUpperCase() + '.json');
            this.baseUrl = setup.Explorer.Indexer.ApiUrl;
            // Remove the trailing / as we expect all URLs we build up expect it.
            if (this.baseUrl.endsWith('/')) {
                this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
            }
            // if (environment.useLocalIndexer) {
            //    this.baseUrl = 'http://localhost:9910/api';
            // }
            return setup;
        });
    }
    loadSetups() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.download('https://chains.blockcore.net/CHAINS.json');
        });
    }
    getInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.downloadRelative('/stats/info');
        });
    }
    getLastBlock(transactions = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.downloadRelative('/query/block/latest');
        });
    }
    getBlocks(offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.downloadRelative('/query/block?offset=' + offset + '&limit=' + limit);
        });
    }
    getBlocksRequest(offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.downloadRelative('/query/block?offset=' + offset + '&limit=' + limit);
        });
    }
    getBlockByHeight(index) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.downloadRelative('/query/block/index/' + index);
        });
    }
    getBlockByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.downloadRelative('/query/block/' + hash);
        });
    }
    getTransaction(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.downloadRelative('/query/transaction/' + hash);
        });
    }
    getAddress(address, transactions = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = transactions ? '/transactions' : '';
            return this.downloadRelative('/query/address/' + address + options);
        });
    }
    getPeers(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.downloadRelative('/stats/peers/' + date.toISOString());
        });
    }
    parseLinkHeader(linkHeader) {
        const sections = linkHeader.split(', ');
        //const links: Record<string, string> = { };
        const links = { first: null, last: null, previous: null, next: null };
        sections.forEach(section => {
            const key = section.substring(section.indexOf('rel="') + 5).replace('"', '');
            const value = section.substring(section.indexOf('<') + 1, section.indexOf('>'));
            links[key] = value;
        });
        return links;
    }
};
ApiService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], ApiService);
exports.ApiService = ApiService;
