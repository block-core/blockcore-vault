import { Component, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationState } from '../services/applicationstate.service';
import { HubService } from '../services/hub.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StateComponent implements OnDestroy {
  displayedColumns = ['category', 'title'];
  dataSource = [];
  columnsToDisplay = ['category', 'title'];
  item: any;
  itemClone: any;
  items = [];
  customers: any;
  isEditing = false;

  selectItem(message) {
    console.log('SELECT:', message);

    // Clone the message.
    this.item = JSON.parse(JSON.stringify(message));
    this.isEditing = true;
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
    this.item = null;
    this.isEditing = false;
  }

  saveEdit() {
    // const document = {
    //   content: JSON.stringify(this.message.content)
    // }

    // this.message.content = JSON.stringify(this.message.content);

    console.log(this.item);

    if (this.item._id) {
      this.http.put<any>(this.baseUrl + 'api/storage/state/' + this.item._id, this.item).subscribe(result => {

        this.loadItems();
        this.item = null;
        this.isEditing = false;

        console.log('RESULT FROM UPDATE', result);


      }, error => console.error(error));
    } else {
      this.http.post<any>(this.baseUrl + 'api/storage/state/', this.item).subscribe(result => {

        this.loadItems();
        this.item = null;
        this.isEditing = false;

        console.log('RESULT FROM CREATE', result);

      }, error => console.error(error));
    }
  }

  deleteItem(message) {
    this.http.delete(this.baseUrl + 'api/storage/state/' + message._id).subscribe(result => {

      this.loadItems();
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

  loadItems() {
    this.http.get<any>(this.baseUrl + 'api/storage/state').subscribe(result => {

      // if (result) {
      //   for (let i of result) {
      //     // Turn the string content into JSON content.
      //     i.content = JSON.parse(i.content);
      //   }
      // }

      this.items = result;
      console.log(this.items);

      this.dataSource = this.items;

    }, error => console.error(error));
  }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private breakpointObserver: BreakpointObserver,
    private appState: ApplicationState,
    private changeRef: ChangeDetectorRef,
    private hub: HubService) {

    appState.title = 'State';
    appState.actions = [{ key: 'add_circle', tooltip: 'Add new state', click: () => { this.addNew(); } }];

    this.loadItems();
  }

  ngOnDestroy(): void {
    this.appState.title = '';
    this.appState.actions = [];
  }

  addNew() {
    this.item = { key: 'unique-key', value: '0' };
    this.isEditing = true;
    this.changeRef.markForCheck();
  }
}
