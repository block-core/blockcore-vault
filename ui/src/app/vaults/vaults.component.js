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
exports.VaultsComponent = void 0;
const core_1 = require("@angular/core");
const animations_1 = require("@angular/animations");
let VaultsComponent = class VaultsComponent {
    constructor(http, baseUrl, breakpointObserver, appState, api, changeRef, hub) {
        this.http = http;
        this.baseUrl = baseUrl;
        this.breakpointObserver = breakpointObserver;
        this.appState = appState;
        this.api = api;
        this.changeRef = changeRef;
        this.hub = hub;
        this.displayedColumns = ['category', 'title'];
        this.dataSource = [];
        this.columnsToDisplay = ['category', 'title'];
        this.items = [];
        this.isEditing = false;
        console.log(this.baseUrl);
        this.baseUrl = 'http://localhost:5000/';
        console.log(this.baseUrl);
        appState.title = 'Vaults';
        appState.actions = [{ icon: 'add_circle', tooltip: 'Add new vault', click: () => { this.addNew(); } }];
        this.loadItems();
    }
    ngOnDestroy() {
        this.appState.title = '';
        this.appState.actions = [];
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
    onUrlEntered() {
        // Do not use the API here, we don't want to send credentials on this query.
        if (this.item.url.indexOf('/') == -1) {
            this.item.url += '/';
        }
        let configurationUrl = this.item.url + '/.well-known/vault-configuration.json';
        this.http.get(configurationUrl).subscribe(data => {
            console.log(data);
        });
    }
    saveEdit() {
        // const document = {
        //   content: JSON.stringify(this.message.content)
        // }
        // this.message.content = JSON.stringify(this.message.content);
        console.log(this.item);
        if (this.item.created) {
            this.item.modified = this.item.created = Date.now();
            this.api.put(this.baseUrl + 'api/vault/' + this.item.id, this.item).subscribe(result => {
                this.loadItems();
                this.item = null;
                this.isEditing = false;
                console.log('RESULT FROM UPDATE', result);
            }, error => console.error(error));
        }
        else {
            this.item.created = Date.now();
            console.log(this.item);
            this.api.post(this.baseUrl + 'api/vault/', this.item).subscribe(result => {
                this.loadItems();
                this.item = null;
                this.isEditing = false;
                console.log('RESULT FROM CREATE', result);
            }, error => console.error(error));
        }
    }
    deleteItem(item) {
        this.api.delete(this.baseUrl + 'api/vault/' + item.id).subscribe(result => {
            this.loadItems();
            this.item = null;
            this.isEditing = false;
            console.log('RESULT FROM UPDATE', result);
        }, error => console.error(error));
    }
    loadItems() {
        this.api.get(this.baseUrl + 'api/vault/').subscribe(result => {
            this.items = result.data;
            console.log(this.items);
            this.dataSource = this.items;
        }, error => console.error(error));
    }
    addNew() {
        this.item = { key: 'unique-key', value: '0', description: '', category: 'pricing' };
        this.isEditing = true;
        this.changeRef.markForCheck();
    }
};
VaultsComponent = __decorate([
    core_1.Component({
        selector: 'app-vaults',
        templateUrl: './vaults.component.html',
        styleUrls: ['./vaults.component.css'],
        animations: [
            animations_1.trigger('detailExpand', [
                animations_1.state('collapsed', animations_1.style({ height: '0px', minHeight: '0' })),
                animations_1.state('expanded', animations_1.style({ height: '*' })),
                animations_1.transition('expanded <=> collapsed', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ],
    }),
    __param(1, core_1.Inject('BASE_URL'))
], VaultsComponent);
exports.VaultsComponent = VaultsComponent;
