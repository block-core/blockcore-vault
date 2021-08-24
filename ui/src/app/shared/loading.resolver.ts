import { Injectable } from '@angular/core';
import {
   Resolve,
   ActivatedRouteSnapshot,
   RouterStateSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap, catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
@Injectable({
   providedIn: 'root'
})
export class LoadingResolverService implements Resolve<any> {
   constructor(
      private api: ApiService
   ) { }
   async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Observable<never>> {
      return null;
   }
}
