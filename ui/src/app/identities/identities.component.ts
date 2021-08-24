import { Component, Inject, HostBinding, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationState } from '../services/applicationstate.service';
import { ApiService } from '../services/api.service';
import { VaultService } from '../services/vault.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-identities',
  templateUrl: './identities.component.html',
  styleUrls: ['./identities.component.css'],
})
export class IdentitiesComponent implements OnInit, AfterViewInit {
  @HostBinding('class.content-centered') hostClass = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['created', 'id'];
  dataSource2: [] = [];
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
    private route: ActivatedRoute,
    @Inject('BASE_URL') private baseUrl: string) {
    appState.title = 'Identities';
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getData({ pageIndex: 0, pageSize: this.appState.pageSize, previousPageIndex: 0, length: 0 });
  }

  getData(event: PageEvent) {
    console.log(event);
    this.isLoadingResults = true;
    this.appState.pageSize = event.pageSize;

    this.api.getIdentities((event.pageIndex + 1), event.pageSize).subscribe(result => {
      var events = result as any;
      this.result = events;
      this.dataSource2 = events.data
      console.log('EVENTS:');
      console.log(events);
      this.isLoadingResults = false;

      this.length = events.totalNumber;

    }, error => console.error(error));
  }
}