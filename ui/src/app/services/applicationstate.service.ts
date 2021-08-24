import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class ApplicationState {

   // account: any;

   // get hasAccount(): boolean {
   //    return this.account != null;
   // }

   title: string;

   actions: any;

   identity: any;

   /** The key pair when unlocked. */
   key: any;

   vault: any;

   goBack: string;

   authenticated: boolean;

   pageSize = 10;

   private _vaultUrl: string = '';

   get vaultUrl(): string {
      return this._vaultUrl;
   }

   set vaultUrl(value: string) {
      this._vaultUrl = value;

      if (this.rememberLogin) {
         localStorage.setItem('DataVault:VaultUrl', value);
      }
   }

   // apiKey: string;

   private _apiKey: string = '';

   get apiKey(): string {
      return this._apiKey;
   }

   set apiKey(value: string) {
      this._apiKey = value;

      if (this.rememberLogin) {
         localStorage.setItem('DataVault:ApiKey', value);
      }
   }

   get rememberLogin(): boolean {
      return localStorage.getItem('DataVault:RememberLogin') == 'true';
   }

   set rememberLogin(value: boolean) {
      if (value) {
         localStorage.setItem('DataVault:ApiKey', this.apiKey);
         localStorage.setItem('DataVault:VaultUrl', this.vaultUrl);
      }
      else {
         localStorage.setItem('DataVault:ApiKey', '');
         localStorage.setItem('DataVault:VaultUrl', '');
      }

      localStorage.setItem('DataVault:RememberLogin', value.toString());
   }

   constructor() {
      if (this.rememberLogin) {
         const existingKey = localStorage.getItem('DataVault:ApiKey');
         this.vaultUrl = localStorage.getItem('DataVault:VaultUrl');

         if (existingKey != null) {
            this._apiKey = existingKey;
         }
      }
   }
}
