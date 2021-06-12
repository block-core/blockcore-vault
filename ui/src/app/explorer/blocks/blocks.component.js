"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.BlocksComponent = void 0;
const core_1 = require("@angular/core");
let BlocksComponent = class BlocksComponent {
    constructor(api, setup) {
        this.api = api;
        this.setup = setup;
        this.hostClass = true;
        this.blocks = null;
        this.count = 0;
        this.maxCount = 2;
        this.limit = 20;
        this.loading = false;
    }
    scrollHandler(event) {
        console.log('Scroll Event');
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.subscription = this.setup.currentChain$.subscribe((chain) => __awaiter(this, void 0, void 0, function* () {
                yield this.updateBlocks('/api/query/block?limit=' + this.limit);
            }));
        });
    }
    ngOnDestroy() {
        clearTimeout(this.timerInfo);
        clearTimeout(this.timerBlocks);
        this.subscription.unsubscribe();
    }
    updateBlocks(url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('url: ', url);
            if (!url) {
                return;
            }
            const baseUrl = this.api.baseUrl.replace('/api', '');
            // For the block scrolling (using link http header), we must manually set full URL.
            const response = yield this.api.request(baseUrl + url);
            this.total = response.headers.get('Pagination-Total');
            const linkHeader = response.headers.get('Link');
            const links = this.api.parseLinkHeader(linkHeader);
            // This will be set to undefined/null when no more previous links is available.
            this.link = links.previous;
            // When the offset is not set (0), we should reverse the order of items.
            const list = yield response.json();
            list.sort((b, a) => {
                if (a.blockIndex === b.blockIndex) {
                    return 0;
                }
                if (a.blockIndex < b.blockIndex) {
                    return -1;
                }
                if (a.blockIndex > b.blockIndex) {
                    return 1;
                }
                return 0;
            });
            if (!this.blocks) {
                this.blocks = [];
            }
            this.blocks = [...this.blocks, ...list];
            this.count++;
        });
    }
    onScroll(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('scroll occurred', event);
            if (event.isReachingBottom) {
                console.log(`the user is reaching the bottom`);
                this.loading = true;
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.updateBlocks(this.link);
                    this.loading = false;
                }));
            }
            if (event.isReachingTop) {
                console.log(`the user is reaching the top`);
            }
            if (event.isWindowEvent) {
                console.log(`This event is fired on Window not on an element.`);
            }
        });
    }
};
__decorate([
    core_1.HostBinding('class.content-centered-top')
], BlocksComponent.prototype, "hostClass", void 0);
__decorate([
    core_1.HostListener('scroll', ['$event'])
], BlocksComponent.prototype, "scrollHandler", null);
BlocksComponent = __decorate([
    core_1.Component({
        selector: 'app-blocks-component',
        templateUrl: './blocks.component.html'
    })
], BlocksComponent);
exports.BlocksComponent = BlocksComponent;
