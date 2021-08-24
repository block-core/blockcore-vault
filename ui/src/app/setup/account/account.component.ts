import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationState } from '../../services/applicationstate.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInUpOnEnterAnimation, bounceOutDownOnLeaveAnimation, flipInYOnEnterAnimation, flipOutYOnLeaveAnimation } from 'angular-animations';
import { verifyJWT } from 'did-jwt';
import * as didJWT from 'did-jwt';
import { Resolver } from 'did-resolver';
import { JwtCredentialPayload, createVerifiableCredentialJwt } from 'did-jwt-vc';
import { Issuer } from 'did-jwt-vc';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as bip38 from '../../../libraries/bip38';
import * as bs58 from 'bs58';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidationDirective } from '../../shared/password-validation.directive';
import { payments } from 'bitcoinjs-lib';
import { BlockcoreIdentity, Identity, BlockcoreIdentityTools } from '@blockcore/identity';
import { IdentityComponent } from 'src/app/identity/identity.component';
// import { BlockcoreIdentityIssuer } from 'blockcore-identity';
import { keyUtils, Secp256k1KeyPair } from '@transmute/did-key-secp256k1';
import { AccountService } from 'src/app/services/account.service';
import { VaultService } from 'src/app/services/vault.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-setup-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'enter' }),
    fadeOutOnLeaveAnimation({ anchor: 'leave', duration: 250 }),
    flipInYOnEnterAnimation(),
    flipOutYOnLeaveAnimation(),
    // fadeInUpOnEnterAnimation({ anchor: 'enter', duration: 1000, delay: 100, translate: '30px' }),
    // bounceOutDownOnLeaveAnimation({ anchor: 'leave', duration: 500, delay: 200, translate: '40px' })
  ]
})
export class AccountComponent implements OnInit {
  @HostBinding('class.content-centered') hostClass = true;

  recoveryPhrase = '';
  gateway = 'https://gateway.blockcore.net/';
  loading = false;
  selectedHubIdInternal = 'local';

  id: string = 'PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';
  key: string = '0xA82AA158A4801BABCA9361D06404E077B7D9D5FDF9674DFCC6B581FA1F32A36F';
  name: string;
  description: string;
  wellknownconfiguration: string;
  mnemonic: string;
  seedExtension = '';
  verification: string;
  password1 = '';
  password2 = '';
  setupDocumentJson: any;
  setupDocument: any;

  get selectedHubId() {
    return this.selectedHubIdInternal;
  }

  set selectedHubId(value: string) {
    this.selectedHubIdInternal = null;
    this.loading = true;

    // Simulate an actual load request.
    setTimeout(() => {
      this.loading = false;
      this.selectedHubIdInternal = value;
    }, 2000);
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private vaultService: VaultService,
    private account: AccountService,
    private appState: ApplicationState) {
    appState.title = 'Setup / Account';

    if (vaultService.hasWallet()) {
      this.router.navigateByUrl('/dashboard');
      return;
    }

    this.onGenerate();

    // When we are not in multichain mode, redirect to chain-home.
    // if (!setup.multiChain) {
    //   router.navigate(['/' + setup.current.toLowerCase()]);
    // }
  }

  cancelEdit() {
    this.id = '';
    this.key = '';
    this.name = '';
    this.description = '';
  }

  public onPrint() {
    window.print();
  }

  updateInfo(event) {
    this.setupDocument = JSON.parse(this.setupDocumentJson);
  }

  private getNewMnemonicLocal() {
    this.mnemonic = bip39.generateMnemonic();
    this.verification = this.mnemonic.split(' ')[2];
  }

  save() {
    const setupPayload = {
      "@context": "https://schemas.blockcore.net/.well-known/vault-configuration/v1",
      "id": this.setupDocument.didDocument.id,
      "url": this.setupDocument.didConfiguration.linked_dids[0].credentialSubject.origin,
      "name": this.name,
      "enabled": true,
      "self": true,
      "ws": "ws://localhost:9090",
      "linked_dids": this.setupDocument.didConfiguration.linked_dids,
      "didDocument": this.setupDocument.didDocument,
      "vaultConfiguration": {
      }
    };

    console.log('Vault URL: ' + this.appState.vaultUrl);

    var headers = new HttpHeaders();
    headers = headers.append('Vault-Api-Key', this.vaultService.vault.key);

    this.http.put<any>(this.appState.vaultUrl + 'management/setup', setupPayload, {
      headers: headers
    }).subscribe(result => {
      console.log('RESULT FROM UPDATE', result);

      if (result.success === true) {
        this.appState.vault = setupPayload;
        this.appState.authenticated = true;
        this.router.navigateByUrl('/dashboard');
      }
    }, error => console.error(error));
  }

  async saveEdit() {
    // // private key User:
    // const privateKeyWif = '7A1HsYie1A7hnzTh7wYwrWmUw1o2Ca4YXdwpkrEgnyDHNLqXPvZ';
    // const privateKeyHex = '0xA82AA158A4801BABCA9361D06404E077B7D9D5FDF9674DFCC6B581FA1F32A36F';
    // const privateKeyBase64 = 'qCqhWKSAG6vKk2HQZATgd7fZ1f35Z038xrWB+h8yo28=';
    // const address = 'PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';

    // // private key Blockcore
    // const privateKeyBlockcoreHex = '039C4896D85A3121039AB57637B9D18FB8686E23AA3EBD26C9731A5F04D5298119';
    // const addressBlockcore = 'PU5DqJxAif5Jr1H3od4ynrnXxLuMejaHuU';

    // const identity = new BlockcoreIdentity(address, privateKeyHex);

    // const jwt = await identity.jwt();
    // console.log('JWT: ' + jwt);

    // console.log('Blockcore Identity (CLI): Create');
    // console.log('Your DID is: ' + identity.id); // 'did:is:PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';
    // console.log('Your DID document is: ' + JSON.stringify(identity.document()));
    // console.log('.well-known configuration: ' + JSON.stringify(identity.wellKnownConfiguration('did.is')));

    // // this.wellknownconfiguration = JSON.stringify(identity.wellKnownConfiguration('did.is'));
    // this.wellknownconfiguration = JSON.stringify(identity.document2(this.name, this.description));

    // // console.log('JWT: ' + identity.jwt());

    // let decoded = didJWT.decodeJWT(jwt)
    // console.log(decoded);

    // // TODO: Fix the getResolver implementation.
    // // const blockcoreResolver = new BlockcoreResolver().getResolver();
    // // const resolver = new Resolver(blockcoreResolver);

    // // const doc = await resolver.resolve(identity.id);
    // // console.log('DID Document: ' + doc);

    // const vcPayload: JwtCredentialPayload = {
    //   sub: identity.id,
    //   nbf: Math.floor(Date.now() / 1000),
    //   vc: {
    //     '@context': ['https://www.w3.org/2018/credentials/v1'],
    //     type: ['VerifiableCredential', 'UniversityDegreeCredential'],
    //     credentialSubject: {
    //       degree: {
    //         type: 'BachelorDegree',
    //         name: 'Bachelor of Science and Arts'
    //       }
    //     }
    //   }
    // }

    // // const issuer: Issuer = new issuer EthrDID({
    // //    address: '0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198',
    // //    privateKey: 'd8b595680851765f38ea5405129244ba3cbad84467d190859f4c8b20c1ff6c75'
    // //  })

    // const issuer: Issuer = new BlockcoreDID({
    //   address: addressBlockcore,
    //   privateKey: privateKeyBlockcoreHex
    // })

    // // const issuer = new Issuer().  didJWT.SimpleSigner(privateKeyHex);

    // const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer)

    // console.log('VC JWT:');
    // console.log(vcJwt);
  }

  get hub() {
    return this.hubs.find(h => h.id === this.selectedHubId);
  }

  hubs = [
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
    }];

  accountPasswordForm: FormGroup;
  accountSeedForm: FormGroup;
  accountNameForm: FormGroup;
  accountName = 'vault';
  saving: boolean;
  currentDate: string;

  async createAccount() {
    this.saving = true;
    // this.log.info('Create account:', this.accountName);
    // this.createWallet(new WalletCreation(this.accountName, this.mnemonic, this.password1, this.seedExtension));

    await this.account.restoreFromMnemonic(this.accountName, this.password1, this.mnemonic, this.seedExtension);

    this.router.navigateByUrl('/setup');

    // var network = this.getProfileNetwork();

    // // C#: HdOperations.GetExtendedKey(recoveryPhrase, string.Empty);
    // var masterSeed = await bip39.mnemonicToSeed(this.mnemonic, this.seedExtension);

    // const self = this;
    // const masterNode = bip32.fromSeed(masterSeed, network);

    // // eslint-disable-next-line
    // const accountNode = masterNode.derivePath(this.getPath()); // m/302'/616'

    // const identity00 = accountNode.derivePath("0'");
    // const identity11 = accountNode.derivePath("1'");

    // const address00 = this.getAddress(identity00, network);
    // const address11 = this.getAddress(identity11, network);

    // // Extended public key for this account (which can hold multiple identities).
    // const xpub = accountNode.neutered().toBase58();

    // // bip38.encryptAsync(masterNode.privateKey, true, wallet.password, (out) => {
    // // }, null, this.appState.networkParams);

    // // eslint-disable-next-line prefer-const
    // let encryptedKeySeed = bip38.encrypt(masterNode.privateKey, true, this.password1, null, null, network);

    // var wallet = {
    //   name: this.accountName,
    //   isExtPubKeyWallet: false,
    //   extPubKey: xpub,
    //   encryptedSeed: encryptedKeySeed,
    //   chainCode: masterNode.chainCode,
    //   network: 'identity',
    //   creationTime: Date.now() / 1000,
    //   coinType: 616,
    //   lastBlockSyncedHeight: 0,
    //   lastBlockSyncedHash: ''
    // };

    // this.setup.wallet = wallet;

    // const start = new Date().getTime();
    // console.log(wallet);

    // // bip38.decryptAsync(wallet.encryptedSeed, walletLoad.password, (decryptedKey) => {
    // // }, null, this.appState.networkParams);

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
    // // const accountNodeRestored = root.derivePath(this.getPurpose() + "/0'/0'");

    // // Get the first identity, which is the only one we use for vault instances.
    // const address0 = this.getAddress(identity0, network);
    // const address1 = this.getAddress(identity1, network);

    // const xpubidentity0 = identity0.neutered().toBase58();
    // const xpubidentity1 = identity1.neutered().toBase58();

    // localStorage.setItem('DataVault:Identity:0', xpubidentity0);
    // localStorage.setItem('DataVault:Identity:1', xpubidentity1);

    // const identity0Restored = bip32.fromBase58(xpubidentity0, network);

    // if (address0 != this.getAddress(identity0Restored, network)) {
    //   console.log('NO!!! DIFFERENT!!!');
    // }
    // else {
    //   console.log('YES, IS SAME!');
    // }

    // const tools = new BlockcoreIdentityTools();

    // // accountNode.privateKey;
    // // accountNode.publicKey;

    // const didJwk = keyUtils.privateKeyJwkFromPrivateKeyHex(
    //   identity0.privateKey.toString('hex')
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


  }

  public onGenerate() {
    this.mnemonic = this.account.generateMnemonic();
    this.verification = this.mnemonic.split(' ')[2];
    this.currentDate = new Date().toDateString();
  }

  ngOnInit(): void {
    this.accountSeedForm = this.fb.group({
      seedExtension: ['', { updateOn: 'blur' }]
    });

    this.accountPasswordForm = this.fb.group({
      accountPassword: ['', {
        validators: Validators.compose([
          Validators.required,
          Validators.minLength(1)
        ])
      }],
      accountPasswordConfirmation: [''],
    }, { updateOn: 'blur', validator: PasswordValidationDirective.MatchPassword });

    this.accountNameForm = this.fb.group({
      accountName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(24),
        Validators.pattern(/^[a-zA-Z0-9]*$/)
      ]))
    });
  }
}
