import { Component, ViewChild, Inject, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationState } from '../services/applicationstate.service';
import { HubService } from '../services/hub.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

    constructor(
        private appState: ApplicationState,
        private router: Router) {

    }

    ngOnInit(): void {
        this.logout();
    }

    logout() {
        this.appState.authenticated = false;

        // If user decided not to store API key, we'll reset the UI input on exit.
        if (!this.appState.rememberLogin) {
            this.appState.apiKey = '';
            this.appState.vaultUrl = '';
        }

        this.appState.vault = null;

        this.router.navigateByUrl('/connect');
    }
}
