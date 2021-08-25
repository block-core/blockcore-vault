import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApplicationState } from './services/applicationstate.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, flipInYOnEnterAnimation, flipOutYOnLeaveAnimation, fadeInUpAnimation, fadeOutDownAnimation, fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, zoomOutOnLeaveAnimation, fadeOutLeftOnLeaveAnimation, fadeOutLeftBigOnLeaveAnimation, bounceOutLeftOnLeaveAnimation, fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation } from 'angular-animations';
import { HttpClient } from '@angular/common/http';
import { VaultService } from './services/vault.service';
import { MatSidenav } from '@angular/material/sidenav';
import { EventBusService, EventBusSubscription } from './services/event-bus.service';

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
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatSidenav;
  @ViewChild('draweraccount') draweraccount!: MatSidenav;
  @Output() openEvent = new EventEmitter<string>();
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
    public vaultService: VaultService,
    private api: ApiService,
    private bus: EventBusService,
    private router: Router,
    // /.auth/me
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver) {

    router.events.subscribe((val) => {
      // When navigation starts, clear the goBack value.
      if (val instanceof NavigationStart) {
        // this.uiState.showBackButton = false;
        this.appState.goBack = null;
      }
    });

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
  }

  subscriptions: EventBusSubscription[] = [];

  ngOnDestroy(): void {
    this.bus.unlisten(this.subscriptions);
  }

  ngOnInit() {
    this.subscriptions.push(this.bus.listen('details-open', () => {
      this.draweraccount.open();
    }));

    this.subscriptions.push(this.bus.listen('details-close', () => {
      this.draweraccount.close();
    }));
  }

  onOpenEvent() {
    this.openEvent.emit();
  }

  openEventHander($event: any) {
    console.log($event);
  }

  onOpenDetails() {
    this.draweraccount.open();
  }

  parseToken(token: any[]) {
    const identity = token[0];
    const name = identity.user_claims.find((c: { typ: string; }) => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname').val;
    this.welcomeName = name;
  }

  connectTo(vault: any) {
    this.appState.key = '';
    this.appState.vaultUrl = '';

    if (!vault) {
      // this.appState.key = '';
      // this.appState.vaultUrl = '';
      this.router.navigate(['/connect']);
    } else {
      // this.appState.apiKey = vault.apiKey;
      // this.appState.vaultUrl = vault.vaultUrl;
      this.router.navigate(['/connect', vault.id]);
    }
  }
}
