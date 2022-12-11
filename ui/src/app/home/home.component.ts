import { Component, HostBinding, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationState } from '../services/applicationstate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  @HostBinding('class.content-centered') hostClass = true;

  constructor(
    @Inject('API_BASE_URL') private apiBaseUrl: string,
    private appState: ApplicationState,
    private router: Router
  ) {}

  async ngOnInit() {
    if (this.appState.authenticated) {
      this.router.navigateByUrl('/dashboard');
    } else {
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
      } else {
        this.router.navigateByUrl('/connect');
      }
    }
  }
}
