import { Component, HostBinding, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApplicationState } from '../services/applicationstate.service';
import { ApiService } from '../services/api.service';
import { VaultService } from '../services/vault.service';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { decodeJWT } from 'did-jwt';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit, AfterViewInit {
  @HostBinding('class.content-centered') hostClass = true;
  result: any;
  decoded: any;

  constructor(private api: ApiService,
    public vaultService: VaultService,
    public appState: ApplicationState,
    private route: ActivatedRoute) {
    appState.title = 'Event';
    appState.goBack = '/events';

    this.route.paramMap.subscribe(async params => {
      this.api.getEvent(params.get('id'), params.get('type'), params.get('operation'), params.get('sequence')).subscribe(result => {
        const item = result as any;
        this.result = item;

        const decodedOperation = decodeJWT(item.jwt);
        const contentJWT = decodedOperation.payload.content;
        this.decoded = decodeJWT(contentJWT).payload;

      });
    });
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
  }
}