import { Component, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationState } from '../services/applicationstate.service';
import { HubService } from '../services/hub.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ServersComponent implements OnDestroy {
  displayedColumns = ['category', 'title'];
  dataSource = [];
  columnsToDisplay = ['category', 'title'];
  didResolution: any;
  linked_dids: any;
  item: any;
  itemClone: any;
  items = [];
  customers: any;
  isEditing = false;
  name: string;

  constructor(
    private http: HttpClient,
    private breakpointObserver: BreakpointObserver,
    public appState: ApplicationState,
    private api: ApiService,
    private changeRef: ChangeDetectorRef,
    private hub: HubService) {

    appState.title = 'Servers';
    appState.actions = [{ icon: 'add_circle', tooltip: 'Connect to Server', click: () => { this.addNew(); } }];

    this.loadItems();
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

  get saveDisabled(): boolean {
    if (!this.didResolution) {
      return true;
    }

    if (this.didResolution.didDocument.id == this.appState.vault.id) {
      return true;
    }

    return false;
  }

  cancelEdit() {
    this.item = null;
    this.isEditing = false;
    this.didResolution = null;
    this.linked_dids = null;
  }

  onUrlEntered() {
    if (!this.item.url || this.item.url.length < 3) {
      return;
    }

    if (this.item.url?.indexOf('/') == -1) { // DID
      // this.item.url += '/';
      let configurationUrl = this.appState.vaultUrl + 'identity/' + this.item.url;

      this.http.get(configurationUrl).subscribe(data => {
        console.log(data);
        // this.item = (<any>data).didDocument;
        this.didResolution = data;
      });
    }
    else { // URL
      let configurationUrl = this.item.url + '/.well-known/did-configuration.json';

      this.http.get(configurationUrl).subscribe(async data => {
        const configuration = <any>data;
        console.log('DID Configuration:', configuration);
        this.linked_dids = configuration.linked_dids;

        // TODO: Perform validation.
        const did = configuration.linked_dids[0].issuer.id;
        const domain = configuration.linked_dids[0].credentialSubject.origin;

        this.api.getIdentityFromUrl(did, domain).subscribe((didResolution) => {
          console.log('DID Resolution:', didResolution);
          //this.item = 
          var didDocument = (<any>didResolution).didDocument;
          this.didResolution = didResolution;

          if (didDocument) {
            this.name = didDocument.service[0].serviceEndpoint;
          }
        });
      });
    }
  }

  saveEdit() {
    // const document = {
    //   content: JSON.stringify(this.message.content)
    // }

    // this.message.content = JSON.stringify(this.message.content);

    var item = this.didResolution.didDocument;
    var url = item.service[0].serviceEndpoint;

    var server: any = {
      id: item.id,
      name: this.name,
      url,
      description: 'Added at ' + new Date() + '.',
      enabled: true,
      linked_dids: this.linked_dids
    };

    // console.log(this.item);

    // If we have a DID Resolution, it means this server has not been added yet.
    // if (this.didResolution) {
    server.created = Date.now();
    console.log(server);

    this.api.createServer(server).subscribe(result => {
      // this.item = null;
      // this.isEditing = false;
      console.log('RESULT FROM CREATE', result);

      this.cancelEdit();
      this.loadItems();
    }, error => console.error(error));

    // }
    // else {
    //   if (this.item.created) {
    //     this.item.modified = this.item.created = Date.now();

    //     this.api.put<any>('api/vault/' + this.item.id, this.item).subscribe(result => {

    //       this.loadItems();
    //       this.item = null;
    //       this.isEditing = false;

    //       console.log('RESULT FROM UPDATE', result);
    //     }, error => console.error(error));
    //   } else {
    //     this.item.created = Date.now();
    //     console.log(this.item);

    //     this.api.post<any>('api/vault/', this.item).subscribe(result => {

    //       this.loadItems();
    //       this.item = null;
    //       this.isEditing = false;

    //       console.log('RESULT FROM CREATE', result);
    //     }, error => console.error(error));
    //   }
    // }
  }

  deleteItem(item) {
    this.api.deleteServer(item.id).subscribe(result => {
      this.loadItems();
    }, error => console.error(error));
  }

  loadItems() {
    this.api.getServers().subscribe(result => {
      this.items = (<any>result).data;
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
