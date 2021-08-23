import { Component, Inject, HostBinding, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationState } from '../services/applicationstate.service';
import { ApiService } from '../services/api.service';
import { VaultService } from '../services/vault.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-identities',
  templateUrl: './identities.component.html',
  styleUrls: ['./identities.component.css'],
})
export class IdentitiesComponent implements OnInit {
  @HostBinding('class.content-centered') hostClass = true;

  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

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
}