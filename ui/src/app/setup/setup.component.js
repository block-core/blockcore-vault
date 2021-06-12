"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupComponent = void 0;
const core_1 = require("@angular/core");
const angular_animations_1 = require("angular-animations");
const blockcore_identity_1 = require("../../libraries/blockcore-did/blockcore-identity");
const didJWT = __importStar(require("did-jwt"));
const did_jwt_vc_1 = require("did-jwt-vc");
const blockcore_did_1 = __importDefault(require("../../libraries/blockcore-did/blockcore-did"));
let SetupComponent = class SetupComponent {
    constructor(setup, router, appState) {
        this.setup = setup;
        this.router = router;
        this.appState = appState;
        this.hostClass = true;
        this.recoveryPhrase = '';
        this.gateway = 'https://gateway.blockcore.net/';
        this.loading = false;
        this.selectedHubIdInternal = 'local';
        this.id = 'PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';
        this.key = '0xA82AA158A4801BABCA9361D06404E077B7D9D5FDF9674DFCC6B581FA1F32A36F';
        this.hubs = [
            {
                host: 'https://localhost:9912',
                id: 'local',
                updated: '2020-05-26 12:00',
                name: 'Local'
            }, {
                host: 'http://20.20.20.20',
                id: 'P0PsadkjfdsT13Aab',
                updated: '2020-05-26 12:00',
                name: 'Haxxors Paradise'
            }, {
                host: 'https://hub.blockcore.net',
                id: 'P1PsadkjfdsT13Aab',
                updated: '2020-05-27 06:00',
                name: 'Blockcore Hub'
            }, {
                host: 'https://hub2.blockcore.net',
                id: 'P2PsadkjfdsT13Aab',
                updated: '2020-05-28 14:00',
                name: 'Blockcore Hub (2)'
            }
        ];
        appState.title = 'Setup';
        // When we are not in multichain mode, redirect to chain-home.
        // if (!setup.multiChain) {
        //   router.navigate(['/' + setup.current.toLowerCase()]);
        // }
    }
    get selectedHubId() {
        return this.selectedHubIdInternal;
    }
    set selectedHubId(value) {
        this.selectedHubIdInternal = null;
        this.loading = true;
        // Simulate an actual load request.
        setTimeout(() => {
            this.loading = false;
            this.selectedHubIdInternal = value;
        }, 2000);
    }
    cancelEdit() {
        this.id = '';
        this.key = '';
        this.name = '';
        this.description = '';
    }
    saveEdit() {
        return __awaiter(this, void 0, void 0, function* () {
            // private key User:
            const privateKeyWif = '7A1HsYie1A7hnzTh7wYwrWmUw1o2Ca4YXdwpkrEgnyDHNLqXPvZ';
            const privateKeyHex = '0xA82AA158A4801BABCA9361D06404E077B7D9D5FDF9674DFCC6B581FA1F32A36F';
            const privateKeyBase64 = 'qCqhWKSAG6vKk2HQZATgd7fZ1f35Z038xrWB+h8yo28=';
            const address = 'PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';
            // private key Blockcore
            const privateKeyBlockcoreHex = '039C4896D85A3121039AB57637B9D18FB8686E23AA3EBD26C9731A5F04D5298119';
            const addressBlockcore = 'PU5DqJxAif5Jr1H3od4ynrnXxLuMejaHuU';
            const identity = new blockcore_identity_1.BlockcoreIdentity(address, privateKeyHex);
            const jwt = yield identity.jwt();
            console.log('JWT: ' + jwt);
            console.log('Blockcore Identity (CLI): Create');
            console.log('Your DID is: ' + identity.id); // 'did:is:PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';
            console.log('Your DID document is: ' + JSON.stringify(identity.document()));
            console.log('.well-known configuration: ' + JSON.stringify(identity.wellKnownConfiguration('did.is')));
            // this.wellknownconfiguration = JSON.stringify(identity.wellKnownConfiguration('did.is'));
            this.wellknownconfiguration = JSON.stringify(identity.document2(this.name, this.description));
            // console.log('JWT: ' + identity.jwt());
            let decoded = didJWT.decodeJWT(jwt);
            console.log(decoded);
            // TODO: Fix the getResolver implementation.
            // const blockcoreResolver = new BlockcoreResolver().getResolver();
            // const resolver = new Resolver(blockcoreResolver);
            // const doc = await resolver.resolve(identity.id);
            // console.log('DID Document: ' + doc);
            const vcPayload = {
                sub: identity.id,
                nbf: Math.floor(Date.now() / 1000),
                vc: {
                    '@context': ['https://www.w3.org/2018/credentials/v1'],
                    type: ['VerifiableCredential', 'UniversityDegreeCredential'],
                    credentialSubject: {
                        degree: {
                            type: 'BachelorDegree',
                            name: 'Bachelor of Science and Arts'
                        }
                    }
                }
            };
            // const issuer: Issuer = new issuer EthrDID({
            //    address: '0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198',
            //    privateKey: 'd8b595680851765f38ea5405129244ba3cbad84467d190859f4c8b20c1ff6c75'
            //  })
            const issuer = new blockcore_did_1.default({
                address: addressBlockcore,
                privateKey: privateKeyBlockcoreHex
            });
            // const issuer = new Issuer().  didJWT.SimpleSigner(privateKeyHex);
            const vcJwt = yield did_jwt_vc_1.createVerifiableCredentialJwt(vcPayload, issuer);
            console.log('VC JWT:');
            console.log(vcJwt);
        });
    }
    get hub() {
        return this.hubs.find(h => h.id === this.selectedHubId);
    }
};
__decorate([
    core_1.HostBinding('class.content-centered')
], SetupComponent.prototype, "hostClass", void 0);
SetupComponent = __decorate([
    core_1.Component({
        selector: 'app-setup',
        templateUrl: './setup.component.html',
        styleUrls: ['./setup.component.css'],
        animations: [
            angular_animations_1.fadeInOnEnterAnimation({ anchor: 'enter' }),
            angular_animations_1.fadeOutOnLeaveAnimation({ anchor: 'leave', duration: 250 }),
            angular_animations_1.flipInYOnEnterAnimation(),
            angular_animations_1.flipOutYOnLeaveAnimation(),
            // fadeInUpOnEnterAnimation({ anchor: 'enter', duration: 1000, delay: 100, translate: '30px' }),
            // bounceOutDownOnLeaveAnimation({ anchor: 'leave', duration: 500, delay: 200, translate: '40px' })
        ]
    })
], SetupComponent);
exports.SetupComponent = SetupComponent;
