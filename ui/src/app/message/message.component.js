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
exports.MessageComponent = exports.TableExpandableRowsExample = void 0;
const core_1 = require("@angular/core");
const animations_1 = require("@angular/animations");
const ELEMENT_DATA = [
    {
        position: 1,
        name: 'Hydrogen',
        weight: 1.0079,
        symbol: 'H',
        description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
    }, {
        position: 2,
        name: 'Helium',
        weight: 4.0026,
        symbol: 'He',
        description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
    }, {
        position: 3,
        name: 'Lithium',
        weight: 6.941,
        symbol: 'Li',
        description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
    }, {
        position: 4,
        name: 'Beryllium',
        weight: 9.0122,
        symbol: 'Be',
        description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`
    }, {
        position: 5,
        name: 'Boron',
        weight: 10.811,
        symbol: 'B',
        description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`
    }, {
        position: 6,
        name: 'Carbon',
        weight: 12.0107,
        symbol: 'C',
        description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`
    }, {
        position: 7,
        name: 'Nitrogen',
        weight: 14.0067,
        symbol: 'N',
        description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
    }, {
        position: 8,
        name: 'Oxygen',
        weight: 15.9994,
        symbol: 'O',
        description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`
    }, {
        position: 9,
        name: 'Fluorine',
        weight: 18.9984,
        symbol: 'F',
        description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`
    }, {
        position: 10,
        name: 'Neon',
        weight: 20.1797,
        symbol: 'Ne',
        description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`
    },
];
class TableExpandableRowsExample {
    constructor() {
        this.dataSource = ELEMENT_DATA;
        this.columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
    }
}
exports.TableExpandableRowsExample = TableExpandableRowsExample;
let MessageComponent = class MessageComponent {
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
        this.isEditing = false;
        appState.title = 'Vaults';
        appState.actions = [{ icon: 'add_circle', tooltip: 'Add new message', click: () => { this.addNewMessage(); } }];
        this.loadMessages();
    }
    selectMessage(message) {
        console.log('SELECT:', message);
        // Clone the message.
        this.message = JSON.parse(JSON.stringify(message));
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
        this.message = null;
        this.isEditing = false;
    }
    saveEdit() {
        // const document = {
        //   content: JSON.stringify(this.message.content)
        // }
        // this.message.content = JSON.stringify(this.message.content);
        console.log(this.message);
        if (this.message._id) {
            this.http.put(this.baseUrl + 'api/storage/message/' + this.message._id, this.message).subscribe(result => {
                this.loadMessages();
                this.message = null;
                this.isEditing = false;
                console.log('RESULT FROM UPDATE', result);
            }, error => console.error(error));
        }
        else {
            this.http.post(this.baseUrl + 'api/storage/message/', this.message).subscribe(result => {
                this.loadMessages();
                this.message = null;
                this.isEditing = false;
                console.log('RESULT FROM CREATE', result);
            }, error => console.error(error));
        }
    }
    deleteMessage(message) {
        this.http.delete(this.baseUrl + 'api/storage/message/' + message._id).subscribe(result => {
            this.loadMessages();
            this.message = null;
            this.isEditing = false;
            console.log('RESULT FROM UPDATE', result);
        }, error => console.error(error));
    }
    broadcastToHubs() {
        const msg = { self: true, date: new Date(), from: 'me', content: this.message };
        console.log('Msg:', msg);
        this.hub.broadcastToHubs(msg);
        this.messages.push(msg);
        this.message = '';
    }
    broadcastToHubsRelayed() {
        const msg = { self: true, date: new Date(), from: 'me', content: this.message };
        console.log('Msg:', msg);
        this.hub.broadcastToHubsRelayed(msg);
        this.messages.push(msg);
        this.message = '';
    }
    broadcastToGateways() {
        const msg = { self: true, date: new Date(), from: 'me', content: this.message };
        console.log('Msg:', msg);
        this.hub.broadcastToGateways(msg);
        this.messages.push(msg);
        this.message = '';
    }
    loadMessages() {
        this.http.get(this.baseUrl + 'api/storage/message').subscribe(result => {
            // if (result) {
            //   for (let i of result) {
            //     // Turn the string content into JSON content.
            //     i.content = JSON.parse(i.content);
            //   }
            // }
            this.messages = result;
            console.log(this.messages);
            this.dataSource = this.messages;
        }, error => console.error(error));
    }
    ngOnDestroy() {
        this.appState.title = '';
        this.appState.actions = [];
    }
    addNewMessage() {
        this.message = { category: 'invoice', title: 'New message', content: 'Fill in description' };
        this.isEditing = true;
        this.changeRef.markForCheck();
    }
};
MessageComponent = __decorate([
    core_1.Component({
        selector: 'app-message',
        templateUrl: './message.component.html',
        styleUrls: ['./message.component.css'],
        animations: [
            animations_1.trigger('detailExpand', [
                animations_1.state('collapsed', animations_1.style({ height: '0px', minHeight: '0' })),
                animations_1.state('expanded', animations_1.style({ height: '*' })),
                animations_1.transition('expanded <=> collapsed', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ],
    }),
    __param(1, core_1.Inject('BASE_URL'))
], MessageComponent);
exports.MessageComponent = MessageComponent;
