import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { SetupService } from './services/setup.service';
import { Router, ActivatedRoute, NavigationEnd, ResolveEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApplicationState } from './services/applicationstate.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, flipInYOnEnterAnimation, flipOutYOnLeaveAnimation, fadeInUpAnimation, fadeOutDownAnimation, fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, zoomOutOnLeaveAnimation, fadeOutLeftOnLeaveAnimation, fadeOutLeftBigOnLeaveAnimation, bounceOutLeftOnLeaveAnimation, fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation } from 'angular-animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'enter' }),
    fadeOutOnLeaveAnimation({ anchor: 'leave', duration: 250 }),
    flipInYOnEnterAnimation(),
    flipOutYOnLeaveAnimation(),
    fadeInUpOnEnterAnimation(),
    fadeOutDownOnLeaveAnimation(),
    zoomOutOnLeaveAnimation(),
    fadeOutLeftBigOnLeaveAnimation(),
    bounceOutLeftOnLeaveAnimation(),
    fadeInDownOnEnterAnimation(),
    fadeOutUpOnLeaveAnimation()
    // fadeInUpOnEnterAnimation({ anchor: 'enter', duration: 1000, delay: 100, translate: '30px' }),
    // bounceOutDownOnLeaveAnimation({ anchor: 'leave', duration: 500, delay: 200, translate: '40px' })
  ]
})
export class AppComponent implements OnInit {
  title = 'app';
  welcomeLoaded = false;
  welcomeLoadedSecond = false;
  welcomeVisible = true;
  welcomeLogo = true;
  welcomeName: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    public appState: ApplicationState,
    private api: ApiService,
    private setup: SetupService,
    private router: Router,


    // /.auth/me
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver) {

    let path = localStorage.getItem('path');
    if (path) {
      localStorage.removeItem('path');
      this.router.navigate([path]);
    }

    // Get the name to display in loading screen!
    // this.getName();

    setTimeout(() => {
      this.welcomeLogo = true;
    }, 1400);

    setTimeout(() => {
      this.welcomeLoaded = true;
    }, 2400);

    setTimeout(() => {
      this.welcomeLoadedSecond = true;
    }, 2700);

    setTimeout(() => {
      this.welcomeVisible = false;
    }, 5000);

    // Initial loading.
    this.setup.getChains();

    this.activatedRoute.paramMap.subscribe(async params => {

      console.log('PARAMS:', params);

      // const id: any = params.get('address');
      // console.log('Address:', id);

      // this.transactions = null;
      // this.address = id;
      // this.balance = await this.api.getAddress(id);
      // console.log(this.balance);

      // await this.updateTransactions('/api/query/address/' + id + '/transactions?limit=' + this.limit);
    });
  }

  async ngOnInit() {

  }

  logout() {
    this.appState.authenticated = false;

    // If user decided not to store API key, we'll reset the UI input on exit.
    if (!this.appState.rememberLogin) {
      this.appState.apiKey = '';
      this.appState.vaultUrl = '';
    }

    this.appState.setup = null;
    this.appState.vault = null;

    this.router.navigateByUrl('/connect');
  }

  parseToken(token: any[]) {
    const identity = token[0];
    const name = identity.user_claims.find((c: { typ: string; }) => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname').val;
    this.welcomeName = name;
  }

  // getName() {
  //   this.http.get<any>(this.baseUrl + '.auth/me').subscribe(result => {
  //     this.parseToken(result);
  //     console.log(result);
  //   }, error => console.error(error));
  // }
}
