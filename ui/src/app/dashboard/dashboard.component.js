"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardComponent = void 0;
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const layout_1 = require("@angular/cdk/layout");
let DashboardComponent = class DashboardComponent {
    constructor(breakpointObserver, appState) {
        this.breakpointObserver = breakpointObserver;
        this.appState = appState;
        /** Based on the screen size, switch from standard to one column per row */
        this.cards = this.breakpointObserver.observe(layout_1.Breakpoints.Handset).pipe(operators_1.map(({ matches }) => {
            if (matches) {
                return [
                    { title: 'Card 1', cols: 1, rows: 1 },
                    { title: 'Card 2', cols: 1, rows: 1 },
                    { title: 'Card 3', cols: 1, rows: 1 },
                    { title: 'Card 4', cols: 1, rows: 1 }
                ];
            }
            return [
                { title: 'Card 1', cols: 2, rows: 1 },
                { title: 'Card 2', cols: 1, rows: 1 },
                { title: 'Card 3', cols: 1, rows: 2 },
                { title: 'Card 4', cols: 1, rows: 1 }
            ];
        }));
        this.features = [
            {
                name: 'DocumentStorage',
                icon: 'note',
                description: 'Provides storage of data entities'
            },
            {
                name: 'FileSharing',
                icon: 'note',
                description: 'Provides query and download of files'
            },
            {
                name: 'Node',
                icon: 'note',
                description: 'Provides blockchain node capabilities'
            }
        ];
        this.apps = [
            {
                name: 'Casino',
                icon: 'casino',
                description: 'Basic casino running on your Hub'
            },
            {
                name: 'Grid Map',
                icon: 'map',
                description: 'Property Registry for Grid Maps'
            },
            {
                name: 'Crypto Pets',
                icon: 'pets',
                description: 'Cute cryptographic pets'
            },
            {
                name: 'Polls',
                icon: 'poll',
                description: 'Host polls and results'
            },
            {
                name: 'Casino',
                icon: 'casino',
                description: 'Basic casino running on your Hub'
            },
            {
                name: 'Grid Map',
                icon: 'map',
                description: 'Property Registry for Grid Maps'
            }
        ];
        appState.title = 'Dashboard';
    }
};
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css']
    })
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
