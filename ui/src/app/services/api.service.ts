import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApplicationState } from './applicationstate.service';
import { VaultService } from './vault.service';
import { Observable } from 'rxjs';

export class HttpError extends Error {
   code: number;
   url: string;

   constructor(code: number, url: string, message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = HttpError.name;
      this.url = url;
      this.code = code;
   }
}

// export class NotFoundError extends HttpError {
//    constructor(message?: string) {
//       super(404, message);
//       Object.setPrototypeOf(this, new.target.prototype);
//       this.name = NotFoundError.name;
//    }
// }

@Injectable({
   providedIn: 'root'
})
export class ApiService {

   setup: any;
   baseUrl: string;

   constructor(
      private http: HttpClient,
      private appState: ApplicationState,
      private vaultService: VaultService
   ) {
      console.log('CREATING INSTANCE OF API SERVICE!!');
   }

   createAuthorizationHeader(headers?: HttpHeaders): HttpHeaders {
      if (!headers) {
         headers = new HttpHeaders();
      }

      headers = headers.append('Vault-Api-Key', this.vaultService.vault.key);

      return headers;
   }

   getUrl<T>(url) {
      return this.http.get<T>(url, {
         headers: this.createAuthorizationHeader()
      });
   }

   postUrl<T>(url, data) {
      return this.http.post<T>(url, data, {
         headers: this.createAuthorizationHeader()
      });
   }

   putUrl<T>(url, data) {
      return this.http.put<T>(url, data, {
         headers: this.createAuthorizationHeader()
      });
   }

   deleteUrl<T>(url) {
      return this.http.delete<T>(url, {
         headers: this.createAuthorizationHeader()
      });
   }

   getByUrl<T>(url, path) {
      return this.getUrl<T>(url + path);
   }

   get<T>(path) {
      return this.getUrl<T>(this.appState.vaultUrl + path);
   }

   post<T>(path, data) {
      return this.postUrl<T>(this.appState.vaultUrl + path, data);
   }

   put<T>(path, data) {
      return this.putUrl(this.appState.vaultUrl + path, data);
   }

   delete<T>(path) {
      return this.deleteUrl(this.appState.vaultUrl + path);
   }

   async download(url, options = {}) {
      console.log('DOWNLOADING:', url);
      const response = await fetch(url, options);
      const json = await response.json();

      if (response.status !== 200) {
         if (json && json.status) {
            throw new HttpError(json.status, url, json.title);
         } else {
            throw new HttpError(response.status, url, response.statusText);
         }
      }

      console.log('DOWNLOADED:', url);
      return json;
   }

   async downloadRelative(path, options = {}) {
      return this.download(this.appState.vaultUrl + path, options);
   }

   async request(url, options = {}) {
      console.log('DOWNLOADING:', url);
      const response = await fetch(url, options);
      return response;
   }

   async requestRelative(path, options = {}) {
      console.log('DOWNLOADING:', this.appState.vaultUrl + path);
      const response = await fetch(this.appState.vaultUrl + path, options);
      return response;
   }

   // async loadSetup(chain: string) {
   //    const setup = await this.download('https://chains.blockcore.net/chains/' + chain.toUpperCase() + '.json');
   //    this.baseUrl = setup.Explorer.Indexer.ApiUrl;

   //    // Remove the trailing / as we expect all URLs we build up expect it.
   //    if (this.baseUrl.endsWith('/')) {
   //       this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
   //    }

   //    // if (environment.useLocalIndexer) {
   //    //    this.baseUrl = 'http://localhost:9910/api';
   //    // }

   //    return setup;
   // }

   // async loadSetups() {
   //    return this.download('https://chains.blockcore.net/CHAINS.json');
   // }

   getIdentity(id: string) {
      return this.get(`identity/${id}`);
      // return this.downloadRelative('query/block?offset=' + offset + '&limit=' + limit);
   }

   getIdentityFromUrl(id: string, url: string) {
      const lastCharacter = url.charAt(url.length - 1);

      if (lastCharacter != '/') {
         url = url + '/';
      }

      return this.getByUrl(url, `identity/${id}`);
      // return this.downloadRelative('query/block?offset=' + offset + '&limit=' + limit);
   }

   getServers() : Observable<any> {
      return this.get(`management/server`);
   }
   
   getServer(id: string) : Observable<any> {
      return this.get(`management/server/${id}`);
   }

   updateServer(server: any) : Observable<any> {
      return this.put(`management/server/${server.id}`, server);
   }

   createServer(server: any) : Observable<any> {
      return this.post(`management/server`, server);
   }

   deleteServer(id: string) : Observable<any> {
      return this.delete(`management/server/${id}`);
   }

   getIdentities(page: number, limit: number) : Observable<any> {
      return this.get(`identity?page=${page}&limit=${limit}`);
      // return this.downloadRelative('query/block?offset=' + offset + '&limit=' + limit);
   }

   getEvents(page: number, limit: number) : Observable<any> {
      return this.get(`event?page=${page}&limit=${limit}`);
      // return this.downloadRelative('query/block?offset=' + offset + '&limit=' + limit);
   }

   getEvent(id: string, type: string, operation: string, sequence: string) : Observable<any> {
      return this.get(`event/${id}/${type}/${operation}/${sequence}`);
      // return this.downloadRelative('query/block?offset=' + offset + '&limit=' + limit);
   }

   getStatistics() : Observable<any> {
      return this.get('management/statistics');
   }

   getSettings() : Observable<any> {
      return this.get('management/setting');
   }

   updateSettings(data: any) : Observable<any> {
      return this.put('management/setting', data);
   }

   async getInfo() {
      return this.downloadRelative('stats/info');
   }

   async getLastBlock(transactions: boolean = true) {
      return this.downloadRelative('query/block/latest');
   }

   async getBlocks(offset: number, limit: number) {
      return this.downloadRelative('query/block?offset=' + offset + '&limit=' + limit);
   }

   async getBlocksRequest(offset: number, limit: number) {
      return this.downloadRelative('query/block?offset=' + offset + '&limit=' + limit);
   }

   async getBlockByHeight(index: number) {
      return this.downloadRelative('query/block/index/' + index);
   }

   async getBlockByHash(hash: string) {
      return this.downloadRelative('/query/block/' + hash);
   }

   async getTransaction(hash: string) {
      return this.downloadRelative('/query/transaction/' + hash);
   }

   async getAddress(address: string, transactions: boolean = false) {
      const options = transactions ? '/transactions' : '';
      return this.downloadRelative('/query/address/' + address + options);
   }

   async getPeers(date: Date) {
      return this.downloadRelative('/stats/peers/' + date.toISOString());
   }

   parseLinkHeader(linkHeader: string) {
      const sections = linkHeader.split(', ');
      //const links: Record<string, string> = { };
      const links = { first: null, last: null, previous: null, next: null };

      sections.forEach(section => {
         const key = section.substring(section.indexOf('rel="') + 5).replace('"', '');
         const value = section.substring(section.indexOf('<') + 1, section.indexOf('>'));
         links[key] = value;
      });

      return links;
   }
}
