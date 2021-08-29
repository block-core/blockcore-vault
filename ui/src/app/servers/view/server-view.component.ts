import { Component, Inject, HostBinding, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationState } from '../../services/applicationstate.service';
import { ApiService } from '../../services/api.service';
import { VaultService } from '../../services/vault.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EventBusService } from '../../services/event-bus.service';
import { decodeJWT } from 'did-jwt';

export class TableStickyHeaderExample {
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-server-view',
  templateUrl: './server-view.component.html',
  styleUrls: ['./server-view.component.css'],
})
export class ServerViewComponent implements OnInit, AfterViewInit {
  @HostBinding('class.content-centered') hostClass = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['type', 'operation', 'sequence', 'received', 'id'];
  dataSource = ELEMENT_DATA;
  dataSource2: [] = [];
  result: any;
  decoded: any;

  isLoadingResults = true;
  isRateLimitReached = false;

  length = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  didDocument: string;
  didDocumentMetadata: string;
  didResolutionMetadata: string;

  item: any;

  constructor(private api: ApiService,
    private http: HttpClient,
    public vaultService: VaultService,
    public appState: ApplicationState,
    private router: Router,
    private bus: EventBusService,
    private route: ActivatedRoute,
    @Inject('BASE_URL') private baseUrl: string) {
    appState.title = 'Server';
    appState.goBack = '/servers';
    appState.actions = [{ icon: 'edit', tooltip: 'Edit Server', click: () => { this.router.navigate(['/servers', 'edit', this.item.id]) } }];

    console.log(appState);

    this.route.paramMap.subscribe(async params => {

      this.api.getServer(params.get('id')).subscribe(result => {
        const item = result as any;
        this.item = item;
        console.log(item);

        // this.didDocument = JSON.stringify(item.didDocument);
        // this.didDocumentMetadata = JSON.stringify(item.didDocumentMetadata);
        // this.didResolutionMetadata = JSON.stringify(item.didResolutionMetadata);

        // const decodedOperation = decodeJWT(item.jwt);
        // const contentJWT = decodedOperation.payload.content;
        // this.decoded = decodeJWT(contentJWT).payload;

      });
    });

  }

  // getData(event: PageEvent) {
  //   console.log(event);
  //   this.isLoadingResults = true;

  //   this.api.getEvents((event.pageIndex + 1), event.pageSize).subscribe(result => {
  //     var events = result as any;
  //     this.result = events;
  //     this.dataSource2 = events.data
  //     console.log('EVENTS:');
  //     console.log(events);
  //     this.isLoadingResults = false;

  //     this.length = events.totalNumber;

  //   }, error => console.error(error));
  // }

  select(row: any) {
    console.log(row);
    this.row = row;

    this.bus.trigger('details-open');
  }

  row: any;

  isSelected(row: any) {
    return (this.row == row);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {

    console.log(setPageSizeOptionsInput);

    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
      console.log(this.pageSizeOptions);
    }
  }

  ngAfterViewInit() {
    // this.getData({ pageIndex: 0, pageSize: this.pageSize, previousPageIndex: 0, length: 0 });

    // this.isLoadingResults = true;

    // this.api.getEvents(1, 10).subscribe(result => {
    //   var events = result as any;
    //   this.result = events;
    //   this.dataSource2 = events.data
    //   console.log('EVENTS:');
    //   console.log(events);
    //   this.isLoadingResults = false;

    //   this.length = events.totalNumber;

    // }, error => console.error(error));

    // this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.exampleDatabase!.getRepoIssues(
    //           this.sort.active, this.sort.direction, this.paginator.pageIndex)
    //         .pipe(catchError(() => observableOf(null)));
    //     }),
    //     map(data => {
    //       // Flip flag to show that loading has finished.
    //       this.isLoadingResults = false;
    //       this.isRateLimitReached = data === null;

    //       if (data === null) {
    //         return [];
    //       }

    //       // Only refresh the result length if there is new data. In case of rate
    //       // limit errors, we do not want to reset the paginator to zero, as that
    //       // would prevent users from re-triggering requests.
    //       this.resultsLength = data.total_count;
    //       return data.items;
    //     })
    //   ).subscribe(data => this.data = data);
  }

  ngOnInit() {

  }
}