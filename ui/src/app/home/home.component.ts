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

    // If there is no vault selected, we'll show the vault selection (connect) page.
    if (!appState.vault) {
      router.navigateByUrl('/connect');
    }
    else {
      if (setup.setupComplete) {
        router.navigateByUrl('/dashboard');
      } else {
        router.navigateByUrl('/setup/account');
      }
    }

    // if (!setup.setupComplete) {
    //   router.navigate(['/setup']);
    // } else {
    //   // When we are not in multichain mode, redirect to chain-home.
    //   if (!setup.multiChain) {
    //     router.navigate(['/' + setup.current.toLowerCase()]);
    //   }
    // }
  }
}
