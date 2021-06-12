"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersComponent = void 0;
const core_1 = require("@angular/core");
const animations_1 = require("@angular/animations");
let CustomersComponent = class CustomersComponent {
    constructor(http, baseUrl, breakpointObserver, appState, changeRef, api, hub) {
        this.http = http;
        this.baseUrl = baseUrl;
        this.breakpointObserver = breakpointObserver;
        this.appState = appState;
        this.changeRef = changeRef;
        this.api = api;
        this.hub = hub;
        this.dataSource = [];
        this.items = [];
        this.selectedMessageId = null;
        this.templates = [];
        this.isEditing = false;
        appState.title = 'Identities';
        appState.actions = [{ icon: 'add_circle', tooltip: 'Add new message', click: () => { this.addNewMessage(); } }];
        this.loadData();
    }
    selectMessage(message) {
        console.log('SELECT:', message);
        // Clone the message.
        this.item = JSON.parse(JSON.stringify(message));
        this.isEditing = true;
        // Restore the template ID if it exists.
        this.selectedMessageId = this.item.template;
    }
    icon(identity) {
        if (identity.enabled) {
            return 'person';
        }
        else {
            return 'person_outline';
        }
    }
    cancelEdit() {
        this.item = null;
        this.isEditing = false;
    }
    saveEdit() {
        this.item.date = new Date().toISOString();
        console.log(this.item);
        if (this.item._id) {
            this.http.put(this.baseUrl + 'api/storage/customers/' + this.item._id, this.item).subscribe(result => {
                this.loadData();
                this.item = null;
                this.isEditing = false;
                console.log('RESULT FROM UPDATE', result);
            }, error => console.error(error));
        }
        else {
            this.http.post(this.baseUrl + 'api/storage/customers/', this.item).subscribe(result => {
                this.loadData();
                this.item = null;
                this.isEditing = false;
                console.log('RESULT FROM CREATE', result);
            }, error => console.error(error));
        }
    }
    deleteMessage(message) {
        this.http.delete(this.baseUrl + 'api/storage/customers/' + message._id).subscribe(result => {
            this.loadData();
            this.item = null;
            this.isEditing = false;
            console.log('RESULT FROM UPDATE', result);
        }, error => console.error(error));
    }
    broadcastToHubs() {
        const msg = { self: true, date: new Date(), from: 'me', content: this.item };
        console.log('Msg:', msg);
        this.hub.broadcastToHubs(msg);
        this.items.push(msg);
        this.item = '';
    }
    broadcastToHubsRelayed() {
        const msg = { self: true, date: new Date(), from: 'me', content: this.item };
        console.log('Msg:', msg);
        this.hub.broadcastToHubsRelayed(msg);
        this.items.push(msg);
        this.item = '';
    }
    broadcastToGateways() {
        const msg = { self: true, date: new Date(), from: 'me', content: this.item };
        console.log('Msg:', msg);
        this.hub.broadcastToGateways(msg);
        this.items.push(msg);
        this.item = '';
    }
    loadData() {
        this.api.get(this.baseUrl + 'identity').subscribe(result => {
            this.items = result;
            this.dataSource = this.items;
            console.log(this.items);
        }, error => console.error(error));
    }
    ngOnDestroy() {
        this.appState.title = '';
        this.appState.actions = [];
    }
    addNewMessage() {
        const message = { category: 'invoice', title: 'Ny melding', content: 'Fill inn en beskrivelse' };
        console.log('CREATE:', message);
        this.item = { content: message };
        this.isEditing = true;
        this.changeRef.markForCheck();
    }
};
CustomersComponent = __decorate([
    core_1.Component({
        selector: 'app-customers',
        templateUrl: './customers.component.html',
        styleUrls: ['./customers.component.css'],
        animations: [
            animations_1.trigger('detailExpand', [
                animations_1.state('collapsed', animations_1.style({ height: '0px', minHeight: '0' })),
                animations_1.state('expanded', animations_1.style({ height: '*' })),
                animations_1.transition('expanded <=> collapsed', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ],
    }),
    __param(1, core_1.Inject('BASE_URL'))
], CustomersComponent);
exports.CustomersComponent = CustomersComponent;
