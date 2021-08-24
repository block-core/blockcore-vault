import { Component, Inject, HostBinding, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationState } from '../services/applicationstate.service';
import { ApiService } from '../services/api.service';
import { VaultService } from '../services/vault.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EventBusService } from '../services/event-bus.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit, AfterViewInit {
  @HostBinding('class.content-centered') hostClass = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['type', 'operation', 'sequence', 'received', 'id'];
  dataSource: [] = [];
  result: any;

  isLoadingResults = true;
  isRateLimitReached = false;

  length = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private api: ApiService,
    private http: HttpClient,
    public vaultService: VaultService,
    public appState: ApplicationState,
    private router: Router,
    private bus: EventBusService,
    private route: ActivatedRoute,
    @Inject('BASE_URL') private baseUrl: string) {
    appState.title = 'Events';
  }

  getData(event: PageEvent) {
    console.log(event);
    this.isLoadingResults = true;
    this.appState.pageSize = event.pageSize;

    this.api.getEvents((event.pageIndex + 1), event.pageSize).subscribe(result => {
      var events = result as any;
      this.result = events;
      this.dataSource = events.data
      console.log('EVENTS:');
      console.log(events);
      this.isLoadingResults = false;

      this.length = events.totalNumber;

    }, error => console.error(error));
  }

  select(row: any) {
    console.log(row);
    this.row = row;

    this.bus.trigger('details-open');
  }

  row: any;

  isSelected(row: any) {
    return (this.row == row);
  }

  ngAfterViewInit() {
    this.getData({ pageIndex: 0, pageSize: this.appState.pageSize, previousPageIndex: 0, length: 0 });
  }

  ngOnInit() {

  }
}