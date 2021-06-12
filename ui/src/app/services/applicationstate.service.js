"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ApplicationState_apiKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationState = void 0;
const core_1 = require("@angular/core");
let ApplicationState = class ApplicationState {
    constructor() {
        // apiKey: string;
        _ApplicationState_apiKey.set(this, '');
        const existingKey = localStorage.getItem('DataVault:ApiKey');
        if (existingKey != null) {
            __classPrivateFieldSet(this, _ApplicationState_apiKey, existingKey, "f");
        }
    }
    get apiKey() {
        return __classPrivateFieldGet(this, _ApplicationState_apiKey, "f");
    }
    set apiKey(value) {
        __classPrivateFieldSet(this, _ApplicationState_apiKey, value, "f");
        localStorage.setItem('DataVault:ApiKey', value);
    }
};
_ApplicationState_apiKey = new WeakMap();
ApplicationState = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], ApplicationState);
exports.ApplicationState = ApplicationState;
