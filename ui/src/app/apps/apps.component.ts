import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationState } from '../services/applicationstate.service';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Crypto Animals', cols: 1, rows: 1 },
          { title: 'Casino', cols: 1, rows: 1 },
          { title: 'Grid Map', cols: 1, rows: 1 },
          { title: 'Crypto Kittens', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Crypto Animals', cols: 2, rows: 1 },
        { title: 'Casino', cols: 1, rows: 1 },
        { title: 'Grid Map', cols: 1, rows: 2 },
        { title: 'Crypto Kittens', cols: 1, rows: 1 }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver, private appState: ApplicationState) {
    appState.title = 'Apps';
  }
}
