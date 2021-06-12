import { Component, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationState } from '../services/applicationstate.service';
import { HubService } from '../services/hub.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MessagesComponent implements OnDestroy {

  displayedColumns = ['category', 'title'];
  dataSource = [];
  columnsToDisplay = ['category', 'title'];

  message: any;
  messageClone: any;

  messages = [];
  customers: any;

  selectedMessageId: string = null;
  templates = [];

  isEditing = false;

  selectMessage(message) {
    console.log('SELECT:', message);

    // Clone the message.
    this.message = JSON.parse(JSON.stringify(message));
    this.isEditing = true;

    // Restore the template ID if it exists.
    this.selectedMessageId = this.message.template;
  }

  icon(category: string) {
    if (category === 'invoice') {
      return 'receipt';
    } else if (category === 'consumption') {
      return 'construction';
    } else {
      return 'folder';
    }
  }

  cancelEdit() {
    this.message = null;
    this.isEditing = false;
  }

  saveEdit() {
    // const document = {
    //   content: JSON.stringify(this.message.content)
    // }

    this.message.date = new Date().toISOString();
    // this.message = JSON.stringify(this.message);

    console.log(this.message);

    if (this.message._id) {
      this.http.put<any>(this.baseUrl + 'api/storage/messages/' + this.message._id, this.message).subscribe(result => {

        this.loadMessages();
        this.message = null;
        this.isEditing = false;

        console.log('RESULT FROM UPDATE', result);

      }, error => console.error(error));
    } else {
      this.http.post<any>(this.baseUrl + 'api/storage/messages/', this.message).subscribe(result => {

        this.loadMessages();
        this.message = null;
        this.isEditing = false;

        console.log('RESULT FROM CREATE', result);

      }, error => console.error(error));
    }
  }

  deleteMessage(message) {
    this.http.delete(this.baseUrl + 'api/storage/messages/' + message._id).subscribe(result => {

      this.loadMessages();
      this.message = null;
      this.isEditing = false;
      console.log('RESULT FROM UPDATE', result);

    }, error => console.error(error));
  }

  loadMessages() {
    this.http.get<any>(this.baseUrl + 'api/storage/messages').subscribe(result => {

      // if (result) {
      //   for (const i of result) {
      //     // Turn the string content into JSON content.
      //     i.content = JSON.parse(i.content);
      //   }
      // }

      this.messages = result;
      console.log(this.messages);

      this.dataSource = this.messages;

    }, error => console.error(error));
  }

  loadMessageTemplates() {
    this.http.get<any>(this.baseUrl + 'api/storage/message').subscribe(result => {

      // if (result) {
      //   for (const i of result) {
      //     // Turn the string content into JSON content.
      //     i.content = JSON.parse(i.content);
      //   }
      // }

      this.templates = result;
      console.log(this.templates);

      // this.dataSource = this.messages;

    }, error => console.error(error));
  }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private breakpointObserver: BreakpointObserver,
    private appState: ApplicationState,
    private changeRef: ChangeDetectorRef,
    private hub: HubService) {

    appState.title = 'Identities';
    appState.actions = [{ icon: 'add_circle', tooltip: 'Add new message', click: () => { this.addNewMessage(); } }];

    this.loadMessageTemplates();
    this.loadMessages();

  }

  ngOnDestroy(): void {
    this.appState.title = '';
    this.appState.actions = [];
  }

  addNewMessage() {

    this.selectedMessageId = null;

    console.log(this);

    console.log('YEEHE!');
    const message = { category: 'invoice', title: 'Ny melding', content: 'Fill inn en beskrivelse' };
    console.log('CREATE:', message);
    this.message = { content: message };
    this.isEditing = true;

    this.changeRef.markForCheck();
  }

  onTemplateChanged(event) {
    console.log(event);

    const templateId = event.value;

    // Take a backup of existing values.
    const customerId = this.message.customer;

    if (templateId) {
      const template = this.templates.find(t => t._id === templateId);
      console.log(template);

      // Clonse the template
      this.message = JSON.parse(JSON.stringify(template));

      // Make sure we remove the "_id" from template.
      delete this.message._id;

      // Set the template ID so we persist where the original message came from.
      this.message.template = templateId;

    } else {
      this.message = {};
    }

    // Restore values we took a reference to.
    this.message.customer = customerId;

  }
}
