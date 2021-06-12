import { Component, HostBinding } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { Router } from '@angular/router';
import { ApplicationState } from '../services/applicationstate.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInUpOnEnterAnimation, bounceOutDownOnLeaveAnimation, flipInYOnEnterAnimation, flipOutYOnLeaveAnimation } from 'angular-animations';

import { BlockcoreIdentity, Identity, BlockcoreResolver } from '../../libraries/blockcore-did/blockcore-identity';
import { verifyJWT } from 'did-jwt';
import * as didJWT from 'did-jwt';
import { Resolver } from 'did-resolver';
import { JwtCredentialPayload, createVerifiableCredentialJwt } from 'did-jwt-vc';
import { Issuer } from 'did-jwt-vc';
import BlockcoreDID from '../../libraries/blockcore-did/blockcore-did';

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
export class SetupComponent {
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

  cancelEdit() {
    this.id = '';
    this.key = '';
    this.name = '';
    this.description = '';
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

    const identity = new BlockcoreIdentity(address, privateKeyHex);

    const jwt = await identity.jwt();
    console.log('JWT: ' + jwt);

    console.log('Blockcore Identity (CLI): Create');
    console.log('Your DID is: ' + identity.id); // 'did:is:PTcn77wZrhugyrxX8AwZxy4xmmqbCvZcKu';
    console.log('Your DID document is: ' + JSON.stringify(identity.document()));
    console.log('.well-known configuration: ' + JSON.stringify(identity.wellKnownConfiguration('did.is')));

    // this.wellknownconfiguration = JSON.stringify(identity.wellKnownConfiguration('did.is'));
    this.wellknownconfiguration = JSON.stringify(identity.document2(this.name, this.description));

    // console.log('JWT: ' + identity.jwt());

    let decoded = didJWT.decodeJWT(jwt)
    console.log(decoded);

    // TODO: Fix the getResolver implementation.
    // const blockcoreResolver = new BlockcoreResolver().getResolver();
    // const resolver = new Resolver(blockcoreResolver);

    // const doc = await resolver.resolve(identity.id);
    // console.log('DID Document: ' + doc);

    const vcPayload: JwtCredentialPayload = {
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
    }

    // const issuer: Issuer = new issuer EthrDID({
    //    address: '0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198',
    //    privateKey: 'd8b595680851765f38ea5405129244ba3cbad84467d190859f4c8b20c1ff6c75'
    //  })

    const issuer: Issuer = new BlockcoreDID({
      address: addressBlockcore,
      privateKey: privateKeyBlockcoreHex
    })

    // const issuer = new Issuer().  didJWT.SimpleSigner(privateKeyHex);

    const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer)

    console.log('VC JWT:');
    console.log(vcJwt);


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

  constructor(public setup: SetupService, private router: Router, private appState: ApplicationState) {
    appState.title = 'Setup';


    // When we are not in multichain mode, redirect to chain-home.
    // if (!setup.multiChain) {
    //   router.navigate(['/' + setup.current.toLowerCase()]);
    // }
  }
}
