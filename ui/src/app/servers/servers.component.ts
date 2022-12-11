import {
  Component,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationState } from '../services/applicationstate.service';
import { HubService } from '../services/hub.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
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
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
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
    private hub: HubService
  ) {
    appState.title = 'Servers';
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
}
