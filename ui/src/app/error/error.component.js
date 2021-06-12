"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorComponent = void 0;
const core_1 = require("@angular/core");
const api_service_1 = require("../services/api.service");
let ErrorComponent = class ErrorComponent {
    constructor() {
        this.detailsVisible = false;
    }
    ngOnChanges(changes) {
        if (!this.error) {
            return;
        }
        if (this.error instanceof api_service_1.HttpError) {
            if (this.error.code === 404) {
                this.message = 'Not found (404)';
                this.details = this.error.url;
                this.stack = this.error.stack.toString();
            }
            else {
                this.message = this.error.message + ' (' + this.error.code + ')';
                this.details = this.error.url;
                this.stack = this.error.stack.toString();
            }
        }
        else if (this.error instanceof Error) {
            this.message = 'Error occured: ' + this.error.message;
            this.stack = this.error.stack.toString();
        }
        else {
            this.message = this.error;
        }
    }
};
__decorate([
    core_1.Input()
], ErrorComponent.prototype, "error", void 0);
ErrorComponent = __decorate([
    core_1.Component({
        selector: 'app-error',
        templateUrl: './error.component.html'
    })
], ErrorComponent);
exports.ErrorComponent = ErrorComponent;
