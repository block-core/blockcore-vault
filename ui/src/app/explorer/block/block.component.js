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
exports.BlockComponent = void 0;
const core_1 = require("@angular/core");
let BlockComponent = class BlockComponent {
    constructor(api, router, setup, activatedRoute) {
        this.api = api;
        this.router = router;
        this.setup = setup;
        this.activatedRoute = activatedRoute;
        this.hostClass = true;
        this.detailsVisible = false;
        this.loading = false;
        this.count = 0;
        this.limit = 20;
        this.activatedRoute.paramMap.subscribe((params) => __awaiter(this, void 0, void 0, function* () {
            const id = params.get('block');
            // LONG_MAX: 9223372036854775807
            this.transactions = null;
            try {
                if (id.length < 20) {
                    this.block = yield this.api.getBlockByHeight(id);
                }
                else {
                    this.block = yield this.api.getBlockByHash(id);
                }
                this.error = null;
            }
            catch (e) {
                this.error = e;
            }
            console.log(this.block);
            // TODO: When refactoring and implementing better state management,
            // the tip should always be easily accessible, as oppose to doing this:
            const lastBlock = yield this.api.getLastBlock(false);
            this.lastBlockHeight = lastBlock.blockIndex;
            yield this.updateTransactions('/api/query/block/index/' + this.block.blockIndex + '/transactions?limit=' + this.limit);
        }));
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    keyEvent(event) {
        console.log(event);
        if (event.key === 'ArrowRight' || event.key === 'PageUp') {
            this.nextBlock();
        }
        if (event.key === 'ArrowLeft' || event.key === 'PageDown') {
            this.previousBlock();
        }
        if (event.key === 'Home') {
            this.navigateToBlock(1);
        }
        if (event.key === 'End') {
            this.lastBlock();
        }
    }
    navigateToBlock(index) {
        // TODO: Figure out how we can navigate relative with the router. "relativeTo"?
        this.router.navigate([this.setup.current, 'explorer', 'block', index]);
    }
    previousBlock() {
        if (this.block.blockIndex === 1) {
            return;
        }
        this.navigateToBlock(this.block.blockIndex - 1);
    }
    nextBlock() {
        if (this.block.blockIndex === this.lastBlockHeight) {
            return;
        }
        this.navigateToBlock(this.block.blockIndex + 1);
    }
    lastBlock() {
        this.navigateToBlock(this.lastBlockHeight);
    }
    toggleDetails() {
        this.detailsVisible = !this.detailsVisible;
    }
    ngOnDestroy() {
    }
    updateTransactions(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // If no URL, then likely reached the end.
            if (!url) {
                return;
            }
            const baseUrl = this.api.baseUrl.replace('/api', '');
            // For the block scrolling (using link http header), we must manually set full URL.
            const response = yield this.api.request(baseUrl + url);
            this.total = response.headers.get('Pagination-Total');
            const linkHeader = response.headers.get('Link');
            const links = this.api.parseLinkHeader(linkHeader);
            // This will be set to undefined/null when no more next links is available.
            this.link = links['next'];
            // When the offset is not set (0), we should reverse the order of items.
            const list = yield response.json();
            // list.sort((b, a) => {
            //   if (a.blockIndex === b.blockIndex) {
            //     return 0;
            //   }
            //   if (a.blockIndex < b.blockIndex) {
            //     return -1;
            //   }
            //   if (a.blockIndex > b.blockIndex) {
            //     return 1;
            //   }
            // });
            if (!this.transactions) {
                this.transactions = [];
            }
            this.transactions = [...this.transactions, ...list];
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
                    yield this.updateTransactions(this.link);
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
], BlockComponent.prototype, "hostClass", void 0);
__decorate([
    core_1.HostListener('window:keyup', ['$event'])
], BlockComponent.prototype, "keyEvent", null);
BlockComponent = __decorate([
    core_1.Component({
        selector: 'app-block-component',
        templateUrl: './block.component.html'
    })
], BlockComponent);
exports.BlockComponent = BlockComponent;
