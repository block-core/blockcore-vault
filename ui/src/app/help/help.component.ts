import { Component, Inject, HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationState } from '../services/applicationstate.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent {
  @HostBinding('class.content-centered') hostClass = true;

  constructor(public appState: ApplicationState) {
    appState.title = 'Help';
  }
}
