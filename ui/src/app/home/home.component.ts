import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationState } from '../services/applicationstate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  @HostBinding('class.content-centered') hostClass = true;

  constructor(
    private appState: ApplicationState,
    private router: Router) {

    if (appState.authenticated) {
      if (appState.vault) {
        router.navigateByUrl('/dashboard');
      } else {
        router.navigateByUrl('/setup/account');
      }
    } else {
      router.navigateByUrl('/connect');
    }
  }
}
