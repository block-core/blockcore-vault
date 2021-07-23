import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Component, HostBinding, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInUpOnEnterAnimation, bounceOutDownOnLeaveAnimation, flipInYOnEnterAnimation, flipOutYOnLeaveAnimation } from 'angular-animations';
import { verifyJWT } from 'did-jwt';
import * as didJWT from 'did-jwt';
import { Resolver } from 'did-resolver';
import { JwtCredentialPayload, createVerifiableCredentialJwt } from 'did-jwt-vc';
import { Issuer } from 'did-jwt-vc';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as bs58 from 'bs58';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { payments } from 'bitcoinjs-lib';
import { BlockcoreIdentity, Identity, BlockcoreIdentityTools } from '@blockcore/identity';
import { IdentityComponent } from 'src/app/identity/identity.component';
// import { BlockcoreIdentityIssuer } from 'blockcore-identity';
import { keyUtils, Secp256k1KeyPair } from '@transmute/did-key-secp256k1';

@Injectable({
   providedIn: 'root'
})
export class SetupService {
   data: any;
   chains: any;

   Chain: any;
   Network: any;
   Indexer: any;
   Explorer: any;

   multiChain: boolean;
   initialized = false;

   setupComplete = false;

   // get setupComplete(): boolean {
   //    return this.wallet != null;
   // }

   // Both SubjectBehavior and Behavior, depending on consumer.
   // The "currentChainSubject$" will return current value as soon as subscribed.
   private readonly currentChainSubjectBehavior = new BehaviorSubject<string>('BLOCKCORE');
   // private readonly currentChainSubject = new Subject<string>();

   // readonly currentChainSubjectBehavior$ = this.currentChainSubjectBehavior.asObservable();
   // readonly currentChainBehavior$ = this.currentChainBehavior.asObservable();
   readonly currentChain$ = this.currentChainSubjectBehavior.asObservable();

   get current(): string {
      return this.currentChainSubjectBehavior.getValue();
   }

   set current(val: string) {
      this.currentChainSubjectBehavior.next(val);
   }

   did: string;

   private _wallet: any = '';

   get wallet(): any {
      return this._wallet;
   }

   set wallet(value: any) {
      this._wallet = value;
      localStorage.setItem('DataVault:Wallet', JSON.stringify(value));
   }

   constructor(
      private http: HttpClient,
      private api: ApiService,
      private router: Router
   ) {
      const existingKey = localStorage.getItem('DataVault:Wallet');

      if (existingKey != null) {
         this._wallet = JSON.parse(existingKey);

         // Parse the wallet and create identity objects.
         const wallet = this.wallet;

         // var network = this.getProfileNetwork();

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

         // const accountNodePrivate = accountNodeRestored; // .derivePath(this.getPath()); // m/302'/616'

         // const identity0 = accountNodePrivate.derivePath("0");
         // const identity1 = accountNodePrivate.derivePath("1");
         // // const accountNodeRestored = root.derivePath(this.getPurpose() + "/0'/0'");

         // // Get the first identity, which is the only one we use for vault instances.
         // const address0 = this.getAddress(identity0, network);
         // const address1 = this.getAddress(identity1, network);

         // const tools = new BlockcoreIdentityTools();

         // accountNode.privateKey;
         // accountNode.publicKey;

         // const didJwk = keyUtils.privateKeyJwkFromPrivateKeyHex(
         //    identity0.privateKey.toString('hex')
         // );

         // const didPublicKeyBase58 = bs58.encode(identity0.publicKey);

         // let keyPairDid = await tools.keyPairFrom({ publicKeyBase58: didPublicKeyBase58, privateKeyHex: identity0.privateKey.toString('hex') });
         // // let keyPairWebKey = await didKeyPair.toJsonWebKeyPair(true);

         // console.log(didJwk);
         // console.log(keyPairDid);

         // // let keyPairDid = await tools.keyPairFrom({ publicKeyBase58: didPublicKeyBase58, privateKeyHex: didKeyPair.privateKeyBuffer?.toString('hex') });
         // // let keyPairWebKey = await didJwk.toJsonWebKeyPair(true);

         // // var tools = new BlockcoreIdentityTools();
         // // return tools.generateKeyPair()
         // var identity = new BlockcoreIdentity(keyPairDid.toKeyPair(false));

         // this.appState.identity = identity;
         // this.appState.key = keyPairDid;

         // console.log(identity);

         // this.did = address0;

         // eslint-disable-next-line @typescript-eslint/prefer-for-of
         // for (let i = 0; i < 2; i++) {
         //     // TODO: Find the last used indexed from querying indexer (persisted to IndexedDB locally)
         //     var path = root.derivePath('0/' + i);
         //     const address = this.getAddress(path, network);
         //     unusedAddresses.push(address);
         //     console.log('0/' + i);
         // }

         // console.log(address0);
      }
   }
}
