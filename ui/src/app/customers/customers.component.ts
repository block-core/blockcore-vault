import { Component, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationState } from '../services/applicationstate.service';
import { HubService } from '../services/hub.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CustomersComponent implements OnDestroy {
  dataSource = [];
  item: any;
  items = [];
  itemClone: any;
  customers: any;
  selectedMessageId: string = null;
  templates = [];
  isEditing = false;

  selectMessage(message: any) {
    console.log('SELECT:', message);

    // Clone the message.
    this.item = JSON.parse(JSON.stringify(message));
    this.isEditing = true;

    // Restore the template ID if it exists.
    this.selectedMessageId = this.item.template;
  }

  icon(identity: any) {
    if (identity.enabled) {
      return 'person';
    }
    else {
      return 'person_outline';
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

  loadData() {
    this.api.get<any>(this.baseUrl + 'identity').subscribe(result => {
      this.items = result;
      this.dataSource = this.items;
      console.log(this.items);
    }, error => console.error(error));
  }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private breakpointObserver: BreakpointObserver,
    private appState: ApplicationState,
    private changeRef: ChangeDetectorRef,
    private api: ApiService,
    private hub: HubService) {

    appState.title = 'Identities';
    appState.actions = [{ icon: 'add_circle', tooltip: 'Add new message', click: () => { this.addNewMessage(); } }];

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
