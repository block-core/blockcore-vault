"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeComponent = void 0;
const core_1 = require("@angular/core");
let HomeComponent = class HomeComponent {
    constructor(setup, router) {
        this.setup = setup;
        this.router = router;
        this.hostClass = true;
        router.navigateByUrl('/dashboard');
        // if (!setup.setupComplete) {
        //   router.navigate(['/setup']);
        // } else {
        //   // When we are not in multichain mode, redirect to chain-home.
        //   if (!setup.multiChain) {
        //     router.navigate(['/' + setup.current.toLowerCase()]);
        //   }
        // }
    }
};
__decorate([
    core_1.HostBinding('class.content-centered')
], HomeComponent.prototype, "hostClass", void 0);
HomeComponent = __decorate([
    core_1.Component({
        selector: 'app-home',
        templateUrl: './home.component.html',
    })
], HomeComponent);
exports.HomeComponent = HomeComponent;
