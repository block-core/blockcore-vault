import { Component, HostBinding } from '@angular/core';
import { SetupService } from '../services/setup.service';
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
    public setup: SetupService,
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
