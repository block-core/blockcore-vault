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
exports.MessagesComponent = void 0;
const core_1 = require("@angular/core");
const animations_1 = require("@angular/animations");
let MessagesComponent = class MessagesComponent {
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
        this.messages = [];
        this.selectedMessageId = null;
        this.templates = [];
        this.isEditing = false;
        appState.title = 'Identities';
        appState.actions = [{ icon: 'add_circle', tooltip: 'Add new message', click: () => { this.addNewMessage(); } }];
        this.loadMessageTemplates();
        this.loadMessages();
    }
    selectMessage(message) {
        console.log('SELECT:', message);
        // Clone the message.
        this.message = JSON.parse(JSON.stringify(message));
        this.isEditing = true;
        // Restore the template ID if it exists.
        this.selectedMessageId = this.message.template;
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
        this.message = null;
        this.isEditing = false;
    }
    saveEdit() {
        // const document = {
        //   content: JSON.stringify(this.message.content)
        // }
        this.message.date = new Date().toISOString();
        // this.message = JSON.stringify(this.message);
        console.log(this.message);
        if (this.message._id) {
            this.http.put(this.baseUrl + 'api/storage/messages/' + this.message._id, this.message).subscribe(result => {
                this.loadMessages();
                this.message = null;
                this.isEditing = false;
                console.log('RESULT FROM UPDATE', result);
            }, error => console.error(error));
        }
        else {
            this.http.post(this.baseUrl + 'api/storage/messages/', this.message).subscribe(result => {
                this.loadMessages();
                this.message = null;
                this.isEditing = false;
                console.log('RESULT FROM CREATE', result);
            }, error => console.error(error));
        }
    }
    deleteMessage(message) {
        this.http.delete(this.baseUrl + 'api/storage/messages/' + message._id).subscribe(result => {
            this.loadMessages();
            this.message = null;
            this.isEditing = false;
            console.log('RESULT FROM UPDATE', result);
        }, error => console.error(error));
    }
    loadMessages() {
        this.http.get(this.baseUrl + 'api/storage/messages').subscribe(result => {
            // if (result) {
            //   for (const i of result) {
            //     // Turn the string content into JSON content.
            //     i.content = JSON.parse(i.content);
            //   }
            // }
            this.messages = result;
            console.log(this.messages);
            this.dataSource = this.messages;
        }, error => console.error(error));
    }
    loadMessageTemplates() {
        this.http.get(this.baseUrl + 'api/storage/message').subscribe(result => {
            // if (result) {
            //   for (const i of result) {
            //     // Turn the string content into JSON content.
            //     i.content = JSON.parse(i.content);
            //   }
            // }
            this.templates = result;
            console.log(this.templates);
            // this.dataSource = this.messages;
        }, error => console.error(error));
    }
    ngOnDestroy() {
        this.appState.title = '';
        this.appState.actions = [];
    }
    addNewMessage() {
        this.selectedMessageId = null;
        console.log(this);
        console.log('YEEHE!');
        const message = { category: 'invoice', title: 'Ny melding', content: 'Fill inn en beskrivelse' };
        console.log('CREATE:', message);
        this.message = { content: message };
        this.isEditing = true;
        this.changeRef.markForCheck();
    }
    onTemplateChanged(event) {
        console.log(event);
        const templateId = event.value;
        // Take a backup of existing values.
        const customerId = this.message.customer;
        if (templateId) {
            const template = this.templates.find(t => t._id === templateId);
            console.log(template);
            // Clonse the template
            this.message = JSON.parse(JSON.stringify(template));
            // Make sure we remove the "_id" from template.
            delete this.message._id;
            // Set the template ID so we persist where the original message came from.
            this.message.template = templateId;
        }
        else {
            this.message = {};
        }
        // Restore values we took a reference to.
        this.message.customer = customerId;
    }
};
MessagesComponent = __decorate([
    core_1.Component({
        selector: 'app-messages',
        templateUrl: './messages.component.html',
        styleUrls: ['./messages.component.css'],
        animations: [
            animations_1.trigger('detailExpand', [
                animations_1.state('collapsed', animations_1.style({ height: '0px', minHeight: '0' })),
                animations_1.state('expanded', animations_1.style({ height: '*' })),
                animations_1.transition('expanded <=> collapsed', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ],
    }),
    __param(1, core_1.Inject('BASE_URL'))
], MessagesComponent);
exports.MessagesComponent = MessagesComponent;
