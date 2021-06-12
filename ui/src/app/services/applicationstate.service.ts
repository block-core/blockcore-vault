import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class ApplicationState {

   title: string;

   actions: any;

   // apiKey: string;

   #apiKey: string = '';

   get apiKey(): string {
      return this.#apiKey;
   }

   set apiKey(value: string) {
      this.#apiKey = value;
      localStorage.setItem('DataVault:ApiKey', value);
   }

   constructor() {
      const existingKey = localStorage.getItem('DataVault:ApiKey');

      if (existingKey != null) {
         this.#apiKey = existingKey;
      }
   }
}
