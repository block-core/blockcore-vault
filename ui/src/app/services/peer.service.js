"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeerService = exports.HubEvent = exports.HttpError = void 0;
const core_1 = require("@angular/core");
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
class HubEvent {
    constructor() {
    }
}
exports.HubEvent = HubEvent;
let PeerService = class PeerService {
    constructor(hubService, ngZone) {
        // TEST DATA FOR UI
        // this.peers.push( {
        //    eventName: 'ConnectionUpdatedEvent',
        //    data: {
        //       command: 0,
        //       connectionType: 'LAN',
        //       externalEndpoint: '192.168.1.1|52881',
        //       id: 637253441645118100,
        //       internalAddresses: ['192.168.1.34', '192.168.9.97'],
        //       internalEndpoint: '0.0.0.0|52881',
        //       name: 'COMPUTER'
        //    }
        // });
        this.hubService = hubService;
        this.ngZone = ngZone;
        this.peers = new Array();
        this.hubService.eventReceived.subscribe((message) => {
            this.ngZone.run(() => {
                if (message.eventName === 'ConnectionAddedEvent') {
                    this.peers.push(message);
                }
                else if (message.eventName === 'ConnectionRemovedEvent') {
                    const indexToRemove = this.peers.findIndex(p => p.data.id === message.data.id);
                    this.peers.splice(indexToRemove);
                }
                else if (message.eventName === 'ConnectionUpdatedEvent') {
                    const indexToUpdate = this.peers.findIndex(p => p.data.id === message.data.id);
                    this.peers[indexToUpdate] = message;
                }
                else if (message.eventName === 'ConnectionStartedEvent') {
                    const indexToUpdate = this.peers.findIndex(p => p.data.id === message.data.id);
                    this.peers[indexToUpdate] = message;
                }
                console.log('PEER SERVICE: ', message);
            });
        });
    }
};
PeerService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], PeerService);
exports.PeerService = PeerService;
