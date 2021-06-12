"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubService = exports.Message = exports.HttpError = void 0;
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
class Message {
    // type: string;
    // date: Date;
    constructor() {
    }
}
exports.Message = Message;
let HubService = class HubService {
    constructor() {
        this.eventReceived = new core_1.EventEmitter();
        this.connectionEstablished = new core_1.EventEmitter();
        this.connectionIsEstablished = false;
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }
    /** Sends a broadcast message to directly connected hubs. */
    broadcastToHubs(message) {
        // this._hubConnection.invoke('BroadcastToHubs', message);
    }
    /** Sends a broadcast message to all hubs connected to the gateways. */
    broadcastToHubsRelayed(message) {
        // this._hubConnection.invoke('BroadcastToHubsRelayed', message);
    }
    /** Sends a broadcast message to connected gateways. */
    broadcastToGateways(message) {
        // this._hubConnection.invoke('BroadcastToGateways', message);
    }
    // sendMessage(message: Message) {
    //    this._hubConnection.invoke('Broadcast', message);
    // }
    // sendMessageToHubs(message: Message) {
    //    this._hubConnection.invoke('BroadcastToHubs', message);
    // }
    connectToPeer(id) {
        // this._hubConnection.invoke('ConnectToPeer', id);
    }
    disconnectToPeer(id) {
        // this._hubConnection.invoke('DisconnectToPeer', id);
    }
    createConnection() {
        // this._hubConnection = new HubConnectionBuilder()
        //    // .withUrl(window.location.href + 'ws')
        //    .withUrl('http://localhost:9912/ws')
        //    .build();
    }
    startConnection() {
        // this._hubConnection
        //    .start()
        //    .then(() => {
        //       this.connectionIsEstablished = true;
        //       console.log('Hub connection started');
        //       this.connectionEstablished.emit(true);
        //    })
        //    .catch(err => {
        //       console.log('Error while establishing connection, retrying...');
        //       setTimeout(function () { this.startConnection(); }, 5000);
        //    });
    }
    registerOnServerEvents() {
        // this._hubConnection.on('Event', (data: any) => {
        //    console.log('DATA:', data);
        //    this.eventReceived.emit(data);
        // });
    }
};
HubService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], HubService);
exports.HubService = HubService;
