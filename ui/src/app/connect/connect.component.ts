import { Component, HostBinding, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { ApplicationState } from '../services/applicationstate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WebProvider } from '@blockcore/provider';
import { BlockcoreIdentity } from '@blockcore/identity';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
})
export class ConnectComponent {
  @HostBinding('class.content-centered') hostClass = true;
  provider?: WebProvider;
  error: string;
  authenticateUrl: string;

  constructor(
    private api: ApiService,
    private http: HttpClient,
    public appState: ApplicationState,
    private router: Router,
    private route: ActivatedRoute,
    @Inject('API_BASE_URL') private apiBaseUrl: string
  ) {
    this.appState.vault = null;
    this.appState.authenticated = false;

    this.authenticateUrl = `${apiBaseUrl}1.0/authenticate`;
    console.log('authenticateUrl:', this.authenticateUrl);
  }

  removeError(): void {
    this.error = '';
  }

  async ngOnInit() {
    if (!this.appState.authenticated) {
      const response = await fetch(
        this.apiBaseUrl + '1.0/authenticate/protected',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status == 200) {
        this.appState.authenticated = true;
        this.router.navigateByUrl('/dashboard');
      }
    }
  }

  async login() {
    this.removeError();

    if (!this.provider) {
      this.provider = await WebProvider.Create();
    }

    try {
      console.log('authenticateUrl:', this.authenticateUrl);

      // First get a challenge from the API.
      const response = await fetch(this.authenticateUrl, {});

      const json = await response.json();
      const challenge = json.challenge;

      if (response.status != 200) {
        throw new Error('Unable to receive authentication challenge.');
      }

      // Request a JWS from the Web5 wallet.
      const result = await this.request('did.request', [
        {
          challenge: challenge,
          methods: 'did:is',
          reason: 'Choose a DID that has permission to this Blockcore Vault.',
        },
      ]);

      // Provide the proof which will result in jwt being written as HttpOnly cookie.
      const postResponse = await fetch(this.authenticateUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.response),
      });

      if (postResponse.status == 200) {
        const content = await postResponse.json();
        console.log('CONTENT FROM AUTH CALL:', content);

        const identity = new BlockcoreIdentity(null);
        this.appState.identity = content.user.did;
        this.appState.short = identity.shorten(content.user.did);
        console.log(this.appState);

        this.appState.authenticated = true;
        this.router.navigateByUrl('/');

        // const postResponse2 = await fetch(this.authenticateUrl + '/protected', {
        //   method: 'GET',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //   },
        // });

        // if (postResponse2.status == 200) {
        //   console.log('PROTECTED WORKS!!!!');
        //   // const content2 = await postResponse2.json();
        //   // console.log(content2);

        //   // // Make sure we keep the URL which is used by the setup account page.
        //   // // this.appState.vaultUrl = this.vault.url;
        //   // this.appState.authenticated = true;
        //   // this.router.navigateByUrl('/');

        //   // Make the current vault available in the app state.
        //   // this.appState.vault = result;
        //   // this.appState.authenticated = true;
        //   // this.router.navigateByUrl('/');
        // } else {
        //   console.log('PROTECTED NO!');
        //   // this.error = postResponse.statusText;
        // }
      } else {
        this.error = postResponse.statusText;
        console.log(
          'Failed to authenticate. Status: ',
          postResponse.statusText
        );
      }
    } catch (err) {
      this.error = err.toString();
      console.error('Failed to authenticate.', err);
    }
  }

  async request(method: string, params?: object | unknown[]) {
    if (!params) {
      params = [];
    }

    const result: any = await this.provider!.request({
      method: method,
      params: params,
    });
    console.log('Result:', result);

    return result;
  }

  handleError(error: any) {
    console.error(error);

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        this.error = `Error: ${error.message}`;
      } else {
        switch (error.status) {
          case 401: //login
            this.error = `Error: ${error.statusText} (${error.status})`;
            break;
          case 403: //forbidden
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
}
