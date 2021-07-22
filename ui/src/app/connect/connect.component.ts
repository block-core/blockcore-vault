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

  constructor(
    private api: ApiService,
    private http: HttpClient,
    public appState: ApplicationState,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {

      // this.appState.vaultUrl = 'http://localhost:3000';
  }

  clear() {
    this.appState.vaultUrl = '';
    this.appState.apiKey = '';
  }

  async connect() {
    var lastCharacter = this.appState.vaultUrl.charAt(this.appState.vaultUrl.length - 1);

    if (lastCharacter != '/') {
      this.appState.vaultUrl = this.appState.vaultUrl + '/';
    }

    console.log('Connecting to ' + this.appState.vaultUrl);

    if (this.appState.vaultUrl.indexOf('http') < -1) {
      console.log('Perform DID query...');
      console.log('Currently unsupported!! Use direct URL.');
    }
    else {
      console.log('Perform .well-known query...');

      var headers = new HttpHeaders();
      headers = headers.append('Vault-Api-Key', this.appState.apiKey);

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
