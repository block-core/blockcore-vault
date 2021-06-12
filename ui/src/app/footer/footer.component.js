"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterComponent = void 0;
const core_1 = require("@angular/core");
let FooterComponent = class FooterComponent {
    constructor(renderer, setup) {
        this.renderer = renderer;
        this.setup = setup;
        this.noHost = '';
        this.updateMode();
    }
    get darkMode() {
        return (localStorage.getItem('dark-mode') === 'on');
    }
    set darkMode(value) {
        if (value) {
            localStorage.setItem('dark-mode', 'on');
        }
        else {
            localStorage.setItem('dark-mode', 'off');
        }
        this.updateMode();
    }
    toggle() {
        // Toggle the dark mode.
        this.darkMode = !this.darkMode;
        // const trans = () => {
        //    document.documentElement.classList.add('transition');
        //    window.setTimeout(() => {
        //       document.documentElement.classList.remove('transition');
        //    }, 500);
        // };
        // trans();
        // Update the UI.
        this.updateMode();
    }
    updateMode() {
        if (this.darkMode) {
            this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark'); //  .addClass(document.body, 'dark');
        }
        else {
            this.renderer.setAttribute(document.documentElement, 'data-theme', 'light');
            // this.renderer.removeClass(document.body, 'dark');
        }
    }
};
__decorate([
    core_1.HostBinding('attr.ngNoHost')
], FooterComponent.prototype, "noHost", void 0);
FooterComponent = __decorate([
    core_1.Component({
        selector: 'app-footer',
        templateUrl: './footer.component.html'
    })
], FooterComponent);
exports.FooterComponent = FooterComponent;
