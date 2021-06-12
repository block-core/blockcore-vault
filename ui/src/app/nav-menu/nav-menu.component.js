"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavMenuComponent = void 0;
const core_1 = require("@angular/core");
let NavMenuComponent = class NavMenuComponent {
    constructor(setup) {
        this.setup = setup;
        this.noHost = '';
    }
    onMouseOver() {
        this.showList = true;
        return false;
    }
    onMouseOut() {
        this.showList = false;
        return false;
    }
};
__decorate([
    core_1.HostBinding('attr.ngNoHost')
], NavMenuComponent.prototype, "noHost", void 0);
NavMenuComponent = __decorate([
    core_1.Component({
        selector: 'app-nav-menu',
        templateUrl: './nav-menu.component.html'
    })
], NavMenuComponent);
exports.NavMenuComponent = NavMenuComponent;
