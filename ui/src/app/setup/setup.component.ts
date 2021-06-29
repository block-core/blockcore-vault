import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { Router } from '@angular/router';
import { ApplicationState } from '../services/applicationstate.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInUpOnEnterAnimation, bounceOutDownOnLeaveAnimation, flipInYOnEnterAnimation, flipOutYOnLeaveAnimation } from 'angular-animations';
import { verifyJWT } from 'did-jwt';
import * as didJWT from 'did-jwt';
import { Resolver } from 'did-resolver';
import { JwtCredentialPayload, createVerifiableCredentialJwt } from 'did-jwt-vc';
import { Issuer } from 'did-jwt-vc';
import * as bip39 from 'bip39';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidationDirective } from '../shared/password-validation.directive';
import { BlockcoreIdentity } from '@blockcore/identity';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'enter' }),
    fadeOutOnLeaveAnimation({ anchor: 'leave', duration: 250 }),
    flipInYOnEnterAnimation(),
    flipOutYOnLeaveAnimation(),
    // fadeInUpOnEnterAnimation({ anchor: 'enter', duration: 1000, delay: 100, translate: '30px' }),
    // bounceOutDownOnLeaveAnimation({ anchor: 'leave', duration: 500, delay: 200, translate: '40px' })
  ]
})
export class SetupComponent implements OnInit {
  @HostBinding('class.content-centered') hostClass = true;

  recoveryPhrase = '';
  gateway = 'https://gateway.blockcore.net/';
  loading = false;
  selectedHubIdInternal = 'local';

  url: string;
  id: string = 'PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';
  key: string = '0xA82AA158A4801BABCA9361D06404E077B7D9D5FDF9674DFCC6B581FA1F32A36F';
  name: string;
  description: string;
  document: any;

  configuration: any;
  configurationJson: string;

  setupDocument: any;
  setupDocumentJson: any;

  mnemonic: string;
  seedExtension = '';
  verification: string;
  password1 = '';
  password2 = '';
  enabled: boolean = true;

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
    @Inject('BASE_URL') private baseUrl: string,
    public setup: SetupService,
    private fb: FormBuilder,
    private router: Router,
    public appState: ApplicationState) {
    appState.title = 'Setup';

    this.id = setup.did;

    console.log(this.appState);

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
    this.url = '';
  }

  public onPrint() {
    window.print();
  }

  private getNewMnemonicLocal() {
    this.mnemonic = bip39.generateMnemonic();
    this.verification = this.mnemonic.split(' ')[2];
  }

  save() {
    console.log('baseUrl: ' + this.baseUrl);

    this.http.put<any>(this.baseUrl + 'management/setup', this.setupDocument).subscribe(result => {
      console.log('RESULT FROM UPDATE', result);

      if (result.success === true) {

        this.appState.setup = this.setupDocument;
        this.appState.account = true;
        this.router.navigateByUrl('/dashboard');
      }
    }, error => console.error(error));
  }

  async saveEdit() {
    // private key User:
    const privateKeyWif = '7A1HsYie1A7hnzTh7wYwrWmUw1o2Ca4YXdwpkrEgnyDHNLqXPvZ';
    const privateKeyHex = '0xA82AA158A4801BABCA9361D06404E077B7D9D5FDF9674DFCC6B581FA1F32A36F';
    const privateKeyBase64 = 'qCqhWKSAG6vKk2HQZATgd7fZ1f35Z038xrWB+h8yo28=';
    const address = 'PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';

    // private key Blockcore
    const privateKeyBlockcoreHex = '039C4896D85A3121039AB57637B9D18FB8686E23AA3EBD26C9731A5F04D5298119';
    const addressBlockcore = 'PU5DqJxAif5Jr1H3od4ynrnXxLuMejaHuU';

    const identity = this.appState.identity;  //new BlockcoreIdentity(address, privateKeyHex);

    // const jwt = await identity.jwt();
    // console.log('JWT: ' + jwt);

    // console.log('Blockcore Identity (CLI): Create');
    // console.log('Your DID is: ' + identity.id); // 'did:is:PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';
    // console.log('Your DID document is: ' + JSON.stringify(identity.document()));
    // console.log('.well-known configuration: ' + JSON.stringify(identity.wellKnownConfiguration('did.is')));

    // this.wellknownconfiguration = JSON.stringify(identity.wellKnownConfiguration('did.is'));
    // this.wellknownconfiguration = JSON.stringify(identity.document2(this.name, this.description));

    // console.log('JWT: ' + identity.jwt());

    // let decoded = didJWT.decodeJWT(jwt)
    // console.log(decoded);

    // TODO: Fix the getResolver implementation.
    // const blockcoreResolver = new BlockcoreResolver().getResolver();
    // const resolver = new Resolver(blockcoreResolver);

    // const doc = await resolver.resolve(identity.id);
    // console.log('DID Document: ' + doc);

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

    this.document = identity.document();

    // Create an issuer from the identity, this is used to issue VCs.
    const issuer = identity.issuer({ privateKey: this.appState.key.privateKeyBuffer?.toString('hex') });
    this.configuration = await identity.configuration(this.url, issuer);
    this.configurationJson = JSON.stringify(this.configuration);

    const setupPayload = {
      "@context": "https://schemas.blockcore.net/.well-known/vault-configuration/v1",
      "id": this.appState.identity.id,
      "url": "http://localhost:3001",
      "name": this.name,
      "enabled": this.enabled,
      "self": true,
      "ws": "ws://localhost:9090",
      "linked_dids": this.configuration.linked_dids,
      "didDocument": this.document,
      "vaultConfiguration": {
      }
    };

    this.setupDocument = setupPayload;
    this.setupDocumentJson = JSON.stringify(this.setupDocument);

    // var vcJwt = await identity.configurationVerifiableCredential(this.url, );

    // const date = new Date();
    // const expiredate = new Date(new Date().setFullYear(date.getFullYear() + 100));
    // let expiredateNumber = Math.floor(expiredate.getTime() / 1000);

    // // Due to issue with Microsoft middleware for JWT validation, we cannot go higher than this expiration date.
    // // Source: https://stackoverflow.com/questions/43593074/jwt-validation-fails/46654832#46654832
    // if (expiredateNumber > 2147483647) {
    //   expiredateNumber = 2147483647;
    // }

    // const currentDateNumber = Math.floor(date.getTime() / 1000);

    // const vcPayload: JwtCredentialPayload = {
    //   // iss: this.id, // This is automatically added by the library and not needed.
    //   exp: expiredateNumber,
    //   iat: currentDateNumber,
    //   nbf: currentDateNumber,
    //   sub: this.id,
    //   vc: {
    //     '@context': [
    //       'https://www.w3.org/2018/credentials/v1',
    //       'https://identity.foundation/.well-known/did-configuration/v1',
    //     ],
    //     type: ['VerifiableCredential', 'DomainLinkageCredential'],
    //     credentialSubject: {
    //       id: this.id,
    //       origin: domain,
    //     },
    //     //"expirationDate": expiredate.toISOString(),
    //     //"issuanceDate": date.toISOString(),
    //     //"issuer": this.id,
    //   },
    // };

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

  public createAccount() {
    this.saving = true;
    // this.log.info('Create account:', this.accountName);
    // this.createWallet(new WalletCreation(this.accountName, this.mnemonic, this.password1, this.seedExtension));
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
