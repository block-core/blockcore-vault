import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class ApplicationState {

   account: any;

   get hasAccount(): boolean {
      return this.account != null;
   }

   title: string;

   actions: any;

   identity: any;

   /** The key pair when unlocked. */
   key: any;

   setup: any;
   
   vault: any;

   authenticated: boolean;

   vaultUrl: string;

   // apiKey: string;

   private _apiKey: string = '';

   get apiKey(): string {
      return this._apiKey;
   }

   set apiKey(value: string) {
      this._apiKey = value;
      localStorage.setItem('DataVault:ApiKey', value);
   }

   constructor() {
      const existingKey = localStorage.getItem('DataVault:ApiKey');

      if (existingKey != null) {
         this._apiKey = existingKey;
      }
   }
}
