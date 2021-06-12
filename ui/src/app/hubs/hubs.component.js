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
exports.HubsComponent = void 0;
const core_1 = require("@angular/core");
let HubsComponent = class HubsComponent {
    // message = new Message();
    constructor(appState, peerService, chatService, ngZone, setup) {
        // this.subscription = this.setup.currentChain$.subscribe(async (chain) => {
        //   await this.updateInfo();
        //   await this.updateBlocks();
        // });
        this.appState = appState;
        this.peerService = peerService;
        this.chatService = chatService;
        this.ngZone = ngZone;
        this.setup = setup;
        // @HostBinding('class.content-centered-top') hostClass = true;
        // info: any;
        // node: any;
        // blockchain: any;
        // network: any;
        // configuration: any;
        // consensus: any;
        // peers: any;
        // blocks: any;
        // timerInfo: any;
        // timerBlocks: any;
        // errorBlocks: string;
        // errorInfo: string;
        // subscription: any;
        // title = 'ClientApp';
        // txtMessage = '';
        // uniqueID: string = new Date().getTime().toString();
        this.messages = new Array();
        appState.title = 'Hubs';
        this.subscribeToEvents();
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            // this.messages.push({ 'message': 'test' });
            // console.log('Messages2:', this.messages2);
        });
    }
    // sendMessage(): void {
    //   if (this.txtMessage) {
    //     this.message = new Message();
    //     this.message.clientuniqueid = this.uniqueID;
    //     this.message.type = 'sent';
    //     this.message.message = this.txtMessage;
    //     this.message.date = new Date();
    //     this.messages.push(this.message);
    //     this.chatService.sendMessage(this.message);
    //     this.txtMessage = '';
    //   }
    // }
    connect(id) {
        console.log('Connect to: ', id);
        this.chatService.connectToPeer(id);
    }
    disconnect(id) {
        console.log('Connect to: ', id);
        this.chatService.disconnectToPeer(id);
    }
    subscribeToEvents() {
        this.chatService.eventReceived.subscribe((message) => {
            this.ngZone.run(() => {
                console.log('MESSAGE FROM HUB: ', message);
                // if (message.clientuniqueid !== this.uniqueID) {
                //   message.type = 'received';
                this.messages.push(message);
                // }
                console.log(this.messages);
            });
        });
    }
    ngOnDestroy() {
        // clearTimeout(this.timerInfo);
        // clearTimeout(this.timerBlocks);
        // this.subscription.unsubscribe();
    }
};
HubsComponent = __decorate([
    core_1.Component({
        selector: 'app-hubs-component',
        templateUrl: './hubs.component.html',
        styleUrls: ['./hubs.component.css']
    })
], HubsComponent);
exports.HubsComponent = HubsComponent;
