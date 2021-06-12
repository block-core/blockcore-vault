"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollDirective = exports.debounce = void 0;
const core_1 = require("@angular/core");
function debounce(delay = 300) {
    return function (target, propertyKey, descriptor) {
        const original = descriptor.value;
        const key = `__timeout__${propertyKey}`;
        descriptor.value = function (...args) {
            clearTimeout(this[key]);
            this[key] = setTimeout(() => original.apply(this, args), delay);
        };
        return descriptor;
    };
}
exports.debounce = debounce;
let ScrollDirective = class ScrollDirective {
    constructor() {
        this.onScroll = new core_1.EventEmitter();
        this.bottomOffset = 100;
        this.topOffset = 100;
    }
    throttle(fn, wait) {
        let time = Date.now();
        return function () {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        };
    }
    scrolled($event) {
        // this.throttle(this.windowScrollEvent($event), 10000);
        this.elementScrollEvent($event);
    }
    windowScrolled($event) {
        // this.throttle(this.windowScrollEvent($event), 10000);
        this.windowScrollEvent($event);
    }
    windowScrollEvent($event) {
        const target = $event.target;
        if (!target || !target.body) {
            return;
        }
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const isReachingTop = scrollTop < this.topOffset;
        const isReachingBottom = (target.body.offsetHeight - (window.innerHeight + scrollTop)) < this.bottomOffset;
        const emitValue = { isReachingBottom, isReachingTop, originalEvent: $event, isWindowEvent: true };
        this.onScroll.emit(emitValue);
    }
    elementScrollEvent($event) {
        const target = $event.target;
        if (!target) {
            return;
        }
        const scrollPosition = target.scrollHeight - target.scrollTop;
        const offsetHeight = target.offsetHeight;
        const isReachingTop = target.scrollTop < this.topOffset;
        const isReachingBottom = (scrollPosition - offsetHeight) < this.bottomOffset;
        const emitValue = { isReachingBottom, isReachingTop, originalEvent: $event, isWindowEvent: false };
        this.onScroll.emit(emitValue);
    }
};
__decorate([
    core_1.Output()
], ScrollDirective.prototype, "onScroll", void 0);
__decorate([
    core_1.Input()
], ScrollDirective.prototype, "bottomOffset", void 0);
__decorate([
    core_1.Input()
], ScrollDirective.prototype, "topOffset", void 0);
__decorate([
    core_1.HostListener('scroll', ['$event']),
    debounce(100)
], ScrollDirective.prototype, "scrolled", null);
__decorate([
    core_1.HostListener('window:scroll', ['$event']),
    debounce(100)
], ScrollDirective.prototype, "windowScrolled", null);
ScrollDirective = __decorate([
    core_1.Directive({
        selector: '[appDetectScroll]'
    })
], ScrollDirective);
exports.ScrollDirective = ScrollDirective;
