import { Component, OnInit } from '@angular/core';
import { ApplicationState } from '../services/applicationstate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
  constructor(private appState: ApplicationState, private router: Router) {}

  ngOnInit(): void {
    this.logout();
  }

  async logout() {
    await fetch('/1.0/authenticate/logout');

    this.appState.authenticated = false;
    this.appState.vault = null;

    this.router.navigateByUrl('/connect');
  }
}
