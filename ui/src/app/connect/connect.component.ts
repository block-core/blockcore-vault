import { Component, Inject, HostBinding } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { ApplicationState } from '../services/applicationstate.service';
import { Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
})
export class ConnectComponent {
  @HostBinding('class.content-centered') hostClass = true;

  vault: string = 'http://localhost:3000';
  key: string;

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private appState: ApplicationState,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {

  }

  clear() {
    this.vault = '';
    this.key = '';
  }

  async connect() {
    var lastCharacter = this.vault.charAt(this.vault.length - 1);

    if (lastCharacter != '/') {
      this.vault = this.vault + '/';
    }

    console.log('Connecting to ' + this.vault);

    this.appState.apiKey = this.key;
    this.appState.vaultUrl = this.vault;

    if (this.vault.indexOf('http') < -1) {
      console.log('Perform DID query...');
      console.log('Currently unsupported!! Use direct URL.');
    }
    else {
      console.log('Perform .well-known query...');

      var headers = new HttpHeaders();
      headers = headers.append('Vault-Api-Key', this.key);

      console.log('HEADERS:');
      console.log(headers);

      this.http.get<any>(this.appState.vaultUrl + '.well-known/did-configuration.json', {
        headers: headers
      }).subscribe(result => {
        console.log('RESULT: ', result);

        this.http.get<any>(this.appState.vaultUrl + 'management/setup', {
          headers: headers
        }).subscribe(result => {
          console.log('RESULT: ', result);

          this.appState.vault = result;
          this.appState.setup = result;
          this.appState.authenticated = true;

          this.router.navigateByUrl('/');

        }, error => console.error(error));

      }, error => console.error(error));

    }
  }
}
