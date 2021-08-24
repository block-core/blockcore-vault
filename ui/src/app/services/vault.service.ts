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
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as bip38 from '../../libraries/bip38';
import * as bs58 from 'bs58';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { payments } from 'bitcoinjs-lib';
import { BlockcoreIdentity, Identity, BlockcoreIdentityTools } from '@blockcore/identity';
import { IdentityComponent } from 'src/app/identity/identity.component';
import { keyUtils, Secp256k1KeyPair } from '@transmute/did-key-secp256k1';
import { emitKeypressEvents } from 'readline';

@Injectable({
    providedIn: 'root'
})
export class VaultService {
    constructor(
        private http: HttpClient,
        private appState: ApplicationState
    ) {
        console.log('CREATING INSTANCE OF VAULT SERVICE!!');

        this.load();
    }

    vaults: any[] = [];

    vault: any;

    addVault(vault: any) {
        this.vaults.push(vault);
        this.save();
    }

    removeVault(vault: any) {
        this.vaults = this.vaults.filter(item => item !== vault);
    }

    hasWallet() {
        if (this.vault == null) {
            throw new Error('No vault selected.');
        }

        if (localStorage.getItem(`DataVault:${this.vault.id}:Wallet`)) {
            return true;
        } else {
            return false;
        }
    }

    persist() {
        this.save();
    }

    private save() {
        localStorage.setItem('DataVault:Vaults', JSON.stringify(this.vaults));
    }

    private load() {
        var value = localStorage.getItem('DataVault:Vaults');

        if (value) {
            this.vaults = JSON.parse(value);
        } else {
            this.vaults = [];
        }
    }

}
