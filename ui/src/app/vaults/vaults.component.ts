import { Component, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationState } from '../services/applicationstate.service';
import { HubService } from '../services/hub.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import * as CID from 'cids';
import { digest } from '@angular/compiler/src/i18n/digest';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VaultsComponent implements OnDestroy {
  displayedColumns = ['category', 'title'];
  dataSource = [];
  columnsToDisplay = ['category', 'title'];
  item: any;
  itemClone: any;
  items = [];
  customers: any;
  isEditing = false;
  publicKey: string;

  vault = {
    id: '',
    controller: '',
    sequence: 0,
    invoker: '',
    delegator: ''
  }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private breakpointObserver: BreakpointObserver,
    private appState: ApplicationState,
    private api: ApiService,
    private changeRef: ChangeDetectorRef,
    private hub: HubService) {

    console.log(this.baseUrl);

    this.baseUrl = 'http://localhost:3000/';

    console.log(this.baseUrl);

    appState.title = 'Vaults';
    appState.actions = [{ icon: 'add_circle', tooltip: 'Create a Data Vault', click: () => { this.addNew(); } }];

    this.loadItems();

    // let entryCID = new CID('123');

    var cid = new CID('QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR').toV1().toString('base32');
    console.log(cid);
    console.log(new CID('QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR'));
  }

  async generate() {
    const text = `${this.vault.controller}#${this.publicKey}`;
    const digestHex = await this.digestMessage(text);
    console.log(digestHex);
    this.vault.id = digestHex;
  }

  async digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
  }

  ngOnDestroy(): void {
    this.appState.title = '';
    this.appState.actions = [];
  }

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

  onUrlEntered() {
    if (this.item.url?.indexOf('/') == -1) { // DID
      // this.item.url += '/';
      let configurationUrl = this.appState.vaultUrl + 'identity/' + this.item.url;

      this.http.get(configurationUrl).subscribe(data => {
        console.log(data);
      });
    }
    else { // URL
      let configurationUrl = this.item.url + '/.well-known/did-configuration.json';

      this.http.get(configurationUrl).subscribe(data => {
        console.log(data);
      });
    }
  }

  saveEdit() {
    // const document = {
    //   content: JSON.stringify(this.message.content)
    // }

    // this.message.content = JSON.stringify(this.message.content);

    console.log(this.item);

    if (this.item.created) {
      this.item.modified = this.item.created = Date.now();

      this.api.put<any>(this.baseUrl + 'api/vault/' + this.item.id, this.item).subscribe(result => {

        this.loadItems();
        this.item = null;
        this.isEditing = false;

        console.log('RESULT FROM UPDATE', result);


      }, error => console.error(error));
    } else {

      this.item.created = Date.now();

      console.log(this.item);

      this.api.post<any>(this.baseUrl + 'api/vault/', this.item).subscribe(result => {

        this.loadItems();
        this.item = null;
        this.isEditing = false;

        console.log('RESULT FROM CREATE', result);

      }, error => console.error(error));
    }
  }

  deleteItem(item) {
    this.api.delete(this.baseUrl + 'api/vault/' + item.id).subscribe(result => {

      this.loadItems();
      this.item = null;
      this.isEditing = false;
      console.log('RESULT FROM UPDATE', result);

    }, error => console.error(error));
  }

  loadItems() {
    this.api.get<any>(this.baseUrl + 'api/vault/').subscribe(result => {
      this.items = result.data;
      console.log(this.items);
      this.dataSource = this.items;

    }, error => console.error(error));
  }

  addNew() {
    this.item = { key: 'unique-key', value: '0', description: '', category: 'pricing' };
    this.isEditing = true;
    this.changeRef.markForCheck();
  }
}
