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

  save() {
    console.log('SAVE!');

    this.removeError();
    this.removeSuccess();

    this.apiService.updateSettings(this.settings).subscribe(result => {
      console.log(result);
      // this.settings = result;
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

  selectMessage(message: any) {
    console.log('SELECT:', message);

    // Clone the message.
    this.item = JSON.parse(JSON.stringify(message));
    this.isEditing = true;

    // Restore the template ID if it exists.
    this.selectedMessageId = this.item.template;
  }

  icon(category: string) {
    if (category === 'lead') {
      return 'done';
    } else if (category === 'waiting') {
      return 'done_all';
    } else if (category === 'customer') {
      return 'person';
    } else if (category === 'inactive') {
      return 'person_outline';
    } else {
      return 'folder';
    }
  }

  cancelEdit() {
    this.item = null;
    this.isEditing = false;
  }

  saveEdit() {
    this.item.date = new Date().toISOString();
    console.log(this.item);

    if (this.item._id) {
      this.http.put<any>(this.baseUrl + 'api/storage/customers/' + this.item._id, this.item).subscribe(result => {

        this.loadData();
        this.item = null;
        this.isEditing = false;

        console.log('RESULT FROM UPDATE', result);

      }, error => console.error(error));
    } else {
      this.http.post<any>(this.baseUrl + 'api/storage/customers/', this.item).subscribe(result => {

        this.loadData();
        this.item = null;
        this.isEditing = false;

        console.log('RESULT FROM CREATE', result);

      }, error => console.error(error));
    }
  }

  deleteMessage(message: { _id: string; }) {
    this.http.delete(this.baseUrl + 'api/storage/customers/' + message._id).subscribe(result => {

      this.loadData();
      this.item = null;
      this.isEditing = false;
      console.log('RESULT FROM UPDATE', result);

    }, error => console.error(error));
  }

  broadcastToHubs() {
    const msg = { self: true, date: new Date(), from: 'me', content: this.item };

    console.log('Msg:', msg);

    this.hub.broadcastToHubs(msg);
    this.items.push(msg);

    this.item = '';
  }

  broadcastToHubsRelayed() {
    const msg = { self: true, date: new Date(), from: 'me', content: this.item };

    console.log('Msg:', msg);

    this.hub.broadcastToHubsRelayed(msg);
    this.items.push(msg);

    this.item = '';
  }

  broadcastToGateways() {
    const msg = { self: true, date: new Date(), from: 'me', content: this.item };

    console.log('Msg:', msg);

    this.hub.broadcastToGateways(msg);
    this.items.push(msg);

    this.item = '';
  }

  previousSettings: any;
  settings: any;

  loadData() {
    this.apiService.getSettings().subscribe(result => {
      console.log(result);
      this.settings = result;
      this.previousSettings = JSON.stringify(result); // clone
    }, error => console.error(error));
  }

  cancel() {
    console.log(JSON.stringify(this.settings));
    console.log(JSON.stringify(this.previousSettings));

    this.settings = JSON.parse(this.previousSettings);
  }

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

    this.loadData();
  }

  ngOnDestroy(): void {
    this.appState.title = '';
    this.appState.actions = [];
  }

  addNewMessage() {
    const message = { category: 'invoice', title: 'Ny melding', content: 'Fill inn en beskrivelse' };
    console.log('CREATE:', message);
    this.item = { content: message };
    this.isEditing = true;
    this.changeRef.markForCheck();
  }

  // onTemplateChanged(event) {
  //   const templateId = event.value;

  //   // Take a backup of existing values.
  //   const customerId = this.item.customer;

  //   if (templateId) {
  //     const template = this.templates.find(t => t._id === templateId);

  //     // Replace the whole structure.
  //     this.item = template;

  //     // Make sure we remove the "_id" from template.
  //     delete this.item._id;

  //     this.item.template = templateId;

  //   } else {
  //     this.item = {};
  //   }

  //   // Restore values we took a reference to.
  //   this.item.customer = customerId;
  // }
}
