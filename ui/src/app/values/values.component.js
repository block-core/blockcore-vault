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
exports.ValuesComponent = void 0;
const core_1 = require("@angular/core");
const animations_1 = require("@angular/animations");
let ValuesComponent = class ValuesComponent {
    constructor(http, baseUrl, breakpointObserver, appState, changeRef, hub) {
        this.http = http;
        this.baseUrl = baseUrl;
        this.breakpointObserver = breakpointObserver;
        this.appState = appState;
        this.changeRef = changeRef;
        this.hub = hub;
        this.displayedColumns = ['category', 'title'];
        this.dataSource = [];
        this.columnsToDisplay = ['category', 'title'];
        this.items = [];
        this.isEditing = false;
        appState.title = 'Values';
        appState.actions = [{ key: 'add_circle', tooltip: 'Add new value', click: () => { this.addNew(); } }];
        this.loadItems();
    }
    selectItem(message) {
        console.log('SELECT:', message);
        // Clone the message.
        this.item = JSON.parse(JSON.stringify(message));
        this.isEditing = true;
    }
    icon(category) {
        if (category === 'invoice') {
            return 'receipt';
        }
        else if (category === 'consumption') {
            return 'construction';
        }
        else {
            return 'folder';
        }
    }
    cancelEdit() {
        this.item = null;
        this.isEditing = false;
    }
    saveEdit() {
        // const document = {
        //   content: JSON.stringify(this.message.content)
        // }
        // this.message.content = JSON.stringify(this.message.content);
        console.log(this.item);
        if (this.item._id) {
            this.http.put(this.baseUrl + 'api/storage/values/' + this.item._id, this.item).subscribe(result => {
                this.loadItems();
                this.item = null;
                this.isEditing = false;
                console.log('RESULT FROM UPDATE', result);
            }, error => console.error(error));
        }
        else {
            this.http.post(this.baseUrl + 'api/storage/values/', this.item).subscribe(result => {
                this.loadItems();
                this.item = null;
                this.isEditing = false;
                console.log('RESULT FROM CREATE', result);
            }, error => console.error(error));
        }
    }
    deleteItem(message) {
        this.http.delete(this.baseUrl + 'api/storage/values/' + message._id).subscribe(result => {
            this.loadItems();
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
    loadItems() {
        this.http.get(this.baseUrl + 'api/storage/values').subscribe(result => {
            // if (result) {
            //   for (let i of result) {
            //     // Turn the string content into JSON content.
            //     i.content = JSON.parse(i.content);
            //   }
            // }
            this.items = result;
            console.log(this.items);
            this.dataSource = this.items;
        }, error => console.error(error));
    }
    ngOnDestroy() {
        this.appState.title = '';
        this.appState.actions = [];
    }
    addNew() {
        this.item = { key: 'unique-key', value: '0', description: '', category: 'pricing' };
        this.isEditing = true;
        this.changeRef.markForCheck();
    }
};
ValuesComponent = __decorate([
    core_1.Component({
        selector: 'app-values',
        templateUrl: './values.component.html',
        styleUrls: ['./values.component.css'],
        animations: [
            animations_1.trigger('detailExpand', [
                animations_1.state('collapsed', animations_1.style({ height: '0px', minHeight: '0' })),
                animations_1.state('expanded', animations_1.style({ height: '*' })),
                animations_1.transition('expanded <=> collapsed', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ],
    }),
    __param(1, core_1.Inject('BASE_URL'))
], ValuesComponent);
exports.ValuesComponent = ValuesComponent;
