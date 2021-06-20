import { Component, HostBinding } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  @HostBinding('class.content-centered') hostClass = true;

  constructor(public setup: SetupService, private router: Router) {

    if (setup.setupComplete) {
      router.navigateByUrl('/dashboard');
    } else {
      router.navigateByUrl('/setup/account');
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
