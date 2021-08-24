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

    generateMnemonic() {
        return bip39.generateMnemonic();

        // this.mnemonic = bip39.generateMnemonic();
        // this.verification = this.mnemonic.split(' ')[2];
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
        const decryptedMasterNodeKey = bip38.decrypt(encryptedSeed, password, null, null, network);
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

    /** Restores account and identities and persist to local storage. */
    async restoreFromMnemonic(name: string, password: string, mnemonic: string, seedExtension: string) {
        var network = this.getProfileNetwork();

        const { masterNode, accountNode } = await this.createAccount(mnemonic, seedExtension);

        const identity0 = accountNode.derivePath("0'");

        const address0 = this.getAddress(identity0);

        const encryptedKeySeed = bip38.encrypt(masterNode.privateKey, true, password, null, null, network);

        // Extended public key for this account, we cannot derive identities from this.
        const xpub = accountNode.neutered().toBase58();

        const xpubidentity0 = identity0.neutered().toBase58();

        localStorage.setItem(`${this.getStorageKey()}:Identity:0`, xpubidentity0);

        var wallet = {
            name,
            isExtPubKeyWallet: false,
            extPubKey: xpub,
            identity0: xpubidentity0,
            did: `did:is:${address0}`,
            encryptedSeed: encryptedKeySeed,
            chainCode: masterNode.chainCode,
            network: 'identity',
            creationTime: Date.now() / 1000,
            coinType: 616,
            lastBlockSyncedHeight: 0,
            lastBlockSyncedHash: ''
        };

        this.wallet = wallet;

        // Get a key pair (public/private)
        var keyPair = await this.getKeyPairFromNode(identity0);

        // Get the identity corresponding with the key pair, does not contain the private key any longer.
        var identity = this.getIdentity(keyPair);

        this.appState.identity = identity;
    }

    /** Creates the account and returns masterNode and accountNode. seed > master > account */
    async createAccount(mnemonic: string, seedExtension: string) {
        // C#: HdOperations.GetExtendedKey(recoveryPhrase, string.Empty);
        var masterSeed = await bip39.mnemonicToSeed(mnemonic, seedExtension);

        const masterNode = bip32.fromSeed(masterSeed, this.getProfileNetwork());

        // Get the hardened purpose and account node.
        const accountNode = masterNode.derivePath(this.getPath()); // m/302'/616'

        return {
            masterNode,
            accountNode
        };

        // Get the hardened identity node.
        // const identity00 = accountNode.derivePath("0'");
        // const identity11 = accountNode.derivePath("1'");

        // const address00 = this.getAddress(identity00, network);
        // const address11 = this.getAddress(identity11, network);

        // Extended public key for this account (which can hold multiple identities).
        // const xpub = accountNode.neutered().toBase58();

        // bip38.encryptAsync(masterNode.privateKey, true, wallet.password, (out) => {
        // }, null, this.appState.networkParams);

        // eslint-disable-next-line prefer-const
        // let encryptedKeySeed = bip38.encrypt(masterNode.privateKey, true, this.password1, null, null, network);

        // var wallet = {
        //     name: this.accountName,
        //     isExtPubKeyWallet: false,
        //     extPubKey: xpub,
        //     encryptedSeed: encryptedKeySeed,
        //     chainCode: masterNode.chainCode,
        //     network: 'identity',
        //     creationTime: Date.now() / 1000,
        //     coinType: 616,
        //     lastBlockSyncedHeight: 0,
        //     lastBlockSyncedHash: ''
        // };

        // this.setup.wallet = wallet;

        // const start = new Date().getTime();
        // console.log(wallet);

        // bip38.decryptAsync(wallet.encryptedSeed, walletLoad.password, (decryptedKey) => {
        // }, null, this.appState.networkParams);

        // const decryptedMasterNodeKey = bip38.decrypt(wallet.encryptedSeed, this.password1, null, null, network);
        // const decryptedMasterNode = bip32.fromPrivateKey(decryptedMasterNodeKey.privateKey, wallet.chainCode, network);
        // const accountNodePrivate = decryptedMasterNode.derivePath(this.getPath()); // m/302'/616'

        // console.log('decrypted!');
        // console.log(decryptedMasterNodeKey);
        // console.log(decryptedMasterNode);
        // console.log(accountNodePrivate);

        // const stop = new Date().getTime();

        // const diff = stop - start;
        // console.log(diff + 'ms taken to decrypt.');

        // const xpubkey = wallet.extPubKey;
        // const root = bip32.fromBase58(xpubkey, network);
        // const accountNodeRestored = bip32.fromBase58(xpubkey, network);

        // console.log(accountNodeRestored);

        // const identity0 = accountNodePrivate.derivePath("0'");
        // const identity1 = accountNodePrivate.derivePath("1'");
        // const accountNodeRestored = root.derivePath(this.getPurpose() + "/0'/0'");

        // Get the first identity, which is the only one we use for vault instances.
        // const address0 = this.getAddress(identity0, network);
        // const address1 = this.getAddress(identity1, network);

        // const xpubidentity0 = identity0.neutered().toBase58();
        // const xpubidentity1 = identity1.neutered().toBase58();

        // localStorage.setItem('DataVault:Identity:0', xpubidentity0);
        // localStorage.setItem('DataVault:Identity:1', xpubidentity1);

        // const identity0Restored = bip32.fromBase58(xpubidentity0, network);

        // if (address0 != this.getAddress(identity0Restored, network)) {
        //     console.log('NO!!! DIFFERENT!!!');
        // }
        // else {
        //     console.log('YES, IS SAME!');
        // }

        // const tools = new BlockcoreIdentityTools();

        // // accountNode.privateKey;
        // // accountNode.publicKey;

        // const didJwk = keyUtils.privateKeyJwkFromPrivateKeyHex(
        //     identity0.privateKey.toString('hex')
        // );

        // const didPublicKeyBase58 = bs58.encode(identity0.publicKey);

        // let keyPairDid = await tools.keyPairFrom({ publicKeyBase58: didPublicKeyBase58, privateKeyHex: identity0.privateKey.toString('hex') });
        // // let keyPairWebKey = await didKeyPair.toJsonWebKeyPair(true);

        // console.log(didJwk);
        // console.log(keyPairDid);

        // let keyPairDid = await tools.keyPairFrom({ publicKeyBase58: didPublicKeyBase58, privateKeyHex: didKeyPair.privateKeyBuffer?.toString('hex') });
        // let keyPairWebKey = await didJwk.toJsonWebKeyPair(true);

        // var tools = new BlockcoreIdentityTools();
        // return tools.generateKeyPair()
        // var identity = new BlockcoreIdentity(keyPairDid.toKeyPair(false));

        // this.appState.identity = identity;
        // this.appState.key = keyPairDid;

        // console.log(identity);

        // this.setup.did = address0;

        // // eslint-disable-next-line @typescript-eslint/prefer-for-of
        // // for (let i = 0; i < 2; i++) {
        // //     // TODO: Find the last used indexed from querying indexer (persisted to IndexedDB locally)
        // //     var path = root.derivePath('0/' + i);
        // //     const address = this.getAddress(path, network);
        // //     unusedAddresses.push(address);
        // //     console.log('0/' + i);
        // // }

        // console.log(address0);

        // this.router.navigateByUrl('/setup');
    }
}
