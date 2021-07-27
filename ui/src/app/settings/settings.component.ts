import { Component, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationState } from '../services/applicationstate.service';
import { HubService } from '../services/hub.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SettingsComponent implements OnDestroy {
  dataSource = [];
  item: any;
  items = [];
  itemClone: any;
  customers: any;
  selectedMessageId: string = null;
  templates = [];
  isEditing = false;
  allowIncomingRequests = true;
  error: string;
  success: string;
  previousSettings: any;
  settings: any;

  get hasModifiedApiKey(): boolean {
    return JSON.parse(this.previousSettings).apiKey != this.settings.apiKey;
  }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private breakpointObserver: BreakpointObserver,
    public appState: ApplicationState,
    private apiService: ApiService,
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private hub: HubService) {

    appState.title = 'Settings';

    this.load();
  }

  load() {
    this.apiService.getSettings().subscribe(result => {
      console.log(result);
      this.settings = result;
      this.previousSettings = JSON.stringify(result); // clone
    }, error => console.error(error));
  }

  save() {
    this.removeError();
    this.removeSuccess();

    this.settings.updated = new Date().toISOString();

    this.apiService.updateSettings(this.settings).subscribe(result => {
      this.success = 'Settings was updated.';

      if (this.hasModifiedApiKey) {
        this.router.navigateByUrl('/connect');
      }
    }, error => this.handleError(error));
  }

  removeError(): void {
    this.error = '';
  }

  removeSuccess(): void {
    this.success = '';
  }

  handleError(error: any) {
    console.error(error);

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        this.error = `Error: ${error.message}`;
      } else {
        switch (error.status) {
          case 401:      //login
            this.error = `Error: ${error.statusText} (${error.status})`;
            break;
          case 403:     //forbidden
            this.error = `Error: ${error.statusText} (${error.status})`;
            break;
          default:
            this.error = `Error: ${error.statusText} (${error.status})`;
            break;
        }
      }
    } else {
      this.error = `Error: Uknown error happened.`;
    }
  }

  cancel() {
    this.settings = JSON.parse(this.previousSettings);
  }

  ngOnDestroy(): void {
    this.appState.title = '';
    this.appState.actions = [];
  }
}
