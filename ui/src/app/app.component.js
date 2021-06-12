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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
const core_1 = require("@angular/core");
const layout_1 = require("@angular/cdk/layout");
const operators_1 = require("rxjs/operators");
const angular_animations_1 = require("angular-animations");
let AppComponent = class AppComponent {
    constructor(http, baseUrl, appState, api, setup, router, 
    // /.auth/me
    activatedRoute, breakpointObserver) {
        this.http = http;
        this.baseUrl = baseUrl;
        this.appState = appState;
        this.api = api;
        this.setup = setup;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.breakpointObserver = breakpointObserver;
        this.title = 'app';
        this.welcomeLoaded = false;
        this.welcomeLoadedSecond = false;
        this.welcomeVisible = true;
        this.welcomeLogo = true;
        this.isHandset$ = this.breakpointObserver.observe(layout_1.Breakpoints.Handset)
            .pipe(operators_1.map(result => result.matches), operators_1.shareReplay());
        let path = localStorage.getItem('path');
        if (path) {
            localStorage.removeItem('path');
            this.router.navigate([path]);
        }
        // Get the name to display in loading screen!
        // this.getName();
        setTimeout(() => {
            this.welcomeLogo = true;
        }, 1400);
        setTimeout(() => {
            this.welcomeLoaded = true;
        }, 2400);
        setTimeout(() => {
            this.welcomeLoadedSecond = true;
        }, 2700);
        setTimeout(() => {
            this.welcomeVisible = false;
        }, 5000);
        // Initial loading.
        this.setup.getChains();
        this.activatedRoute.paramMap.subscribe((params) => __awaiter(this, void 0, void 0, function* () {
            console.log('PARAMS:', params);
            // const id: any = params.get('address');
            // console.log('Address:', id);
            // this.transactions = null;
            // this.address = id;
            // this.balance = await this.api.getAddress(id);
            // console.log(this.balance);
            // await this.updateTransactions('/api/query/address/' + id + '/transactions?limit=' + this.limit);
        }));
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    parseToken(token) {
        const identity = token[0];
        const name = identity.user_claims.find((c) => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname').val;
        this.welcomeName = name;
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss'],
        animations: [
            angular_animations_1.fadeInOnEnterAnimation({ anchor: 'enter' }),
            angular_animations_1.fadeOutOnLeaveAnimation({ anchor: 'leave', duration: 250 }),
            angular_animations_1.flipInYOnEnterAnimation(),
            angular_animations_1.flipOutYOnLeaveAnimation(),
            angular_animations_1.fadeInUpOnEnterAnimation(),
            angular_animations_1.fadeOutDownOnLeaveAnimation(),
            angular_animations_1.zoomOutOnLeaveAnimation(),
            angular_animations_1.fadeOutLeftBigOnLeaveAnimation(),
            angular_animations_1.bounceOutLeftOnLeaveAnimation(),
            angular_animations_1.fadeInDownOnEnterAnimation(),
            angular_animations_1.fadeOutUpOnLeaveAnimation()
            // fadeInUpOnEnterAnimation({ anchor: 'enter', duration: 1000, delay: 100, translate: '30px' }),
            // bounceOutDownOnLeaveAnimation({ anchor: 'leave', duration: 500, delay: 200, translate: '40px' })
        ]
    }),
    __param(1, core_1.Inject('BASE_URL'))
], AppComponent);
exports.AppComponent = AppComponent;
