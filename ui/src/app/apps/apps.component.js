"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppsComponent = void 0;
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const layout_1 = require("@angular/cdk/layout");
let AppsComponent = class AppsComponent {
    constructor(breakpointObserver, appState) {
        this.breakpointObserver = breakpointObserver;
        this.appState = appState;
        /** Based on the screen size, switch from standard to one column per row */
        this.cards = this.breakpointObserver.observe(layout_1.Breakpoints.Handset).pipe(operators_1.map(({ matches }) => {
            if (matches) {
                return [
                    { title: 'Crypto Animals', cols: 1, rows: 1 },
                    { title: 'Casino', cols: 1, rows: 1 },
                    { title: 'Grid Map', cols: 1, rows: 1 },
                    { title: 'Crypto Kittens', cols: 1, rows: 1 }
                ];
            }
            return [
                { title: 'Crypto Animals', cols: 2, rows: 1 },
                { title: 'Casino', cols: 1, rows: 1 },
                { title: 'Grid Map', cols: 1, rows: 2 },
                { title: 'Crypto Kittens', cols: 1, rows: 1 }
            ];
        }));
        appState.title = 'Apps';
    }
};
AppsComponent = __decorate([
    core_1.Component({
        selector: 'app-apps',
        templateUrl: './apps.component.html',
        styleUrls: ['./apps.component.css']
    })
], AppsComponent);
exports.AppsComponent = AppsComponent;
