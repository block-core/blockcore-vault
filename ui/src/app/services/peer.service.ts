import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { HubService } from './hub.service';

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

export class HubEvent {

   // clientuniqueid: string;
   // type: string;
   // message: string;
   // date: Date;

   eventName: string;
   data: any;

   constructor() {

   }
}

@Injectable({
   providedIn: 'root'
})
export class PeerService {
   public peers = new Array<HubEvent>();

   constructor(private hubService: HubService, private ngZone: NgZone) {

      // TEST DATA FOR UI
      // this.peers.push( {
      //    eventName: 'ConnectionUpdatedEvent',
      //    data: {
      //       command: 0,
      //       connectionType: 'LAN',
      //       externalEndpoint: '192.168.1.1|52881',
      //       id: 637253441645118100,
      //       internalAddresses: ['192.168.1.34', '192.168.9.97'],
      //       internalEndpoint: '0.0.0.0|52881',
      //       name: 'COMPUTER'
      //    }
      // });

      this.hubService.eventReceived.subscribe((message: HubEvent) => {
         this.ngZone.run(() => {

            if (message.eventName === 'ConnectionAddedEvent') {
               this.peers.push(message);
            } else if (message.eventName === 'ConnectionRemovedEvent') {
               const indexToRemove = this.peers.findIndex(p => p.data.id === message.data.id);
               this.peers.splice(indexToRemove);
            } else if (message.eventName === 'ConnectionUpdatedEvent') {
               const indexToUpdate = this.peers.findIndex(p => p.data.id === message.data.id);
               this.peers[indexToUpdate] = message;
            } else if (message.eventName === 'ConnectionStartedEvent') {
               const indexToUpdate = this.peers.findIndex(p => p.data.id === message.data.id);
               this.peers[indexToUpdate] = message;
            }

            console.log('PEER SERVICE: ', message);

         });

      });
   }
}
