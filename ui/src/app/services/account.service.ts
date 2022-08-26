import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApplicationState } from './applicationstate.service';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInUpOnEnterAnimation, bounceOutDownOnLeaveAnimation, flipInYOnEnterAnimation, flipOutYOnLeaveAnimation } from 'angular-animations';
import { verifyJWT } from 'did-jwt';
import * as didJWT from 'did-jwt';
import { Resolver } from 'did-resolver';
import { JwtCredentialPayload, createVerifiableCredentialJwt } from 'did-jwt-vc';
import { Issuer } from 'did-jwt-vc';
import * as bip32 from 'bip32';
import * as bs58 from 'bs58';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { payments } from 'bitcoinjs-lib';
import { BlockcoreIdentity, Identity, BlockcoreIdentityTools } from '@blockcore/identity';
import { IdentityComponent } from 'src/app/identity/identity.component';
import { keyUtils, Secp256k1KeyPair } from '@transmute/did-key-secp256k1';
import { VaultService } from './vault.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    setup: any;
    baseUrl: string;

    constructor(
        private http: HttpClient,
        private vaultService: VaultService,
        private appState: ApplicationState
    ) {
        console.log('CREATING INSTANCE OF ACCOUNT SERVICE!!');

        var tmp = localStorage.getItem(`${this.getStorageKey()}:Wallet`);

        if (tmp) {
            this._wallet = JSON.parse(tmp);
        }
    }

    getProfileNetwork() {
        var tools = new BlockcoreIdentityTools();
        return tools.getProfileNetwork();
    }

    getPurpose() {
        // var tools = new BlockcoreIdentityTools();
        // return tools.getPurpose();
        return "302'";
    }

    getIdentityType() {
        return "616'";
    }

    getPath() {
        return `m/${this.getPurpose()}/${this.getIdentityType()}`;
    }

    getAddress(node) {
        const { address } = payments.p2pkh({
            pubkey: node.publicKey,
            network: this.getProfileNetwork(),
        });

        return address;
    }

    getJwkPairFromNode(node: any) {
        const jwk = keyUtils.privateKeyJwkFromPrivateKeyHex(
            node.privateKey.toString('hex')
        );

        return jwk;
    }

    async getKeyPairFromNode(node: any) {
        const tools = new BlockcoreIdentityTools();

        let keyPair = await tools.keyPairFrom({ publicKeyBase58: bs58.encode(node.publicKey), privateKeyHex: node.privateKey.toString('hex') });

        return keyPair;
    }

    restoreAccount(xpubkey: string) {
        var network = this.getProfileNetwork();
        const accountNodeRestored = bip32.fromBase58(xpubkey, network);
        return accountNodeRestored;
    }

    unlockAccount(encryptedSeed: string, password: string, chainCode: Buffer) {
        var network = this.getProfileNetwork();
        // TODO: FIX!!
        const decryptedMasterNodeKey = null; // bip38.decrypt(encryptedSeed, password, null, null, network);
        const decryptedMasterNode = bip32.fromPrivateKey(decryptedMasterNodeKey.privateKey, chainCode, network);
        const accountNode = decryptedMasterNode.derivePath(this.getPath()); // m/302'/616'

        return accountNode;
    }

    getIdentity(keyPair: Secp256k1KeyPair) {
        var identity = new BlockcoreIdentity(keyPair.toKeyPair(false));
        return identity;
    }

    private _wallet: any = '';

    get wallet(): any {
        return this._wallet;
    }

    set wallet(value: any) {
        this._wallet = value;
        localStorage.setItem(`${this.getStorageKey()}:Wallet`, JSON.stringify(value));
    }

    private getStorageKey() {
        return `DataVault:${this.vaultService.vault.id}`;
    }
}
