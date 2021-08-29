import { Component, Inject, HostBinding } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { ApplicationState } from '../services/applicationstate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';
import { VaultService } from '../services/vault.service';

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
    public vaultService: VaultService,
    public appState: ApplicationState,
    private router: Router,
    private route: ActivatedRoute,
    @Inject('BASE_URL') private baseUrl: string) {

    this.appState.vault = null;
    this.appState.authenticated = false;

    // this.appState.vaultUrl = 'http://localhost:3000';

    this.clear();
  }

  clear() {
    // this.appState.vaultUrl = '';
    // this.appState.apiKey = '';

    this.vault = {
      remember: true
    };
  }

  error: string;

  removeError(): void {
    this.error = '';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    var vault = this.vaultService.vaults.find(v => v.id == id);

    if (vault) {
      this.vault = vault;
    }
  }

  handleError(error: any) {
    console.error(error);

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        this.error = `Error: ${error.message}`;
      } else {
        switch (error.status) {
          case 401:      //login
            this.error = `Error: ${error.statusText} (${error.status})`;
            break;
          case 403:     //forbidden
            this.error = `Error: ${error.statusText} (${error.status})`;
            break;
          default:
            this.error = `Error: ${error.statusText} (${error.status})`;
            break;
        }
      }
    } else {
      this.error = `Error: Uknown error happened.`;
    }
  }

  get hasVaultSelected(): boolean {
    return this._vault.id;
  }

  private _vault: any = { remember: true };

  get vault(): any {
    return this._vault;
  }

  set vault(value: any) {
    if (!value) {
      value = {
        remember: true
      };
    }

    this._vault = value;
    console.log(value);

    if (value) {
      this.appState.vaultUrl = value.url;
      this.appState.apiKey = value.key;
      this.appState.rememberLogin = value.remember;
    }
    else {
      this.appState.vaultUrl = '';
      this.appState.apiKey = '';
    }
  }

  //vaults = [{ id: 'localhost', name: 'localhost', url: 'http://localhost:3000', remember: true, key: '5768ae34-5749-4a02-b67a-734b0cccfa9a' }, { id: 'did:is:PTlsaksjkluihJHjk123hf', name: 'did:is:PTlsaksjkluihJHjk123hf', url: 'https://vault1.blockcore.net', remember: false }];

  remove(vault) {
    this.vaultService.removeVault(vault);
    this.clear();
  }

  async connect() {
    this.removeError();

    if (!this.vault.url) {
      this.error = 'The DID or URL is missing.';
      return;
    }

    this.vaultService.vault = this.vault;

    var lastCharacter = this.vault.url.charAt(this.vault.url.length - 1);

    if (lastCharacter != '/') {
      this.vault.url = this.vault.url + '/';
    }

    console.log('Connecting to ' + this.vault.url);

    if (this.vault.url.indexOf('http') < -1) {
      console.log('Perform DID query...');
      console.log('Currently unsupported!! Use direct URL.');
    }
    else {
      console.log('Perform .well-known query...');

      var headers = new HttpHeaders();

      if (this.vault.key) {
        headers = headers.append('Vault-Api-Key', this.vault.key);
      }

      this.http.get<any>(this.vault.url + '.well-known/did-configuration.json', {
        headers: headers
      }).subscribe(result => {

        console.log('RESULT: ', result);

        this.http.get<any>(this.vault.url + 'management/setup', {
          headers: headers
        }).subscribe(result => {
          console.log('RESULT: ', result);

          if (!this.hasVaultSelected) {
            // Query and authentication went well, register the vault.

            // We don't know the name yet, so we'll use the URL.
            this.vault.name = this.vault.url;

            // Generate a random local unique ID for this vault.
            this.vault.id = Math.floor((Math.random() * 100000) + 1);;

            this.vaultService.addVault(this.vault);
          }

          // The user might have updated the Api Key, make sure we persist the vaults.
          this.vaultService.persist();

          // If there is an error, it is most likely not configured yet.
          if (result.error) {
            // Make sure we keep the URL which is used by the setup account page.
            this.appState.vaultUrl = this.vault.url;
            this.appState.authenticated = true;
            this.router.navigateByUrl('/setup/account');
          } else {
            // Make the current vault available in the app state.
            this.appState.vault = result;
            this.appState.authenticated = true;
            this.router.navigateByUrl('/');
          }

        }, error => {
          this.handleError(error);
        });

      }, error => {
        this.handleError(error);
      });

    }
  }
}
