import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EventEmitter, Injectable } from '@angular/core';

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

export class Message {

   from: string;
   content: string;
   // type: string;
   // date: Date;

   constructor() {

   }
}

@Injectable({
   providedIn: 'root'
})
export class HubService {
   eventReceived = new EventEmitter<Message>();
   connectionEstablished = new EventEmitter<Boolean>();

   private connectionIsEstablished = false;

   constructor() {
      this.createConnection();
      this.registerOnServerEvents();
      this.startConnection();
   }

   /** Sends a broadcast message to directly connected hubs. */
   broadcastToHubs(message: Message) {
      // this._hubConnection.invoke('BroadcastToHubs', message);
   }

   /** Sends a broadcast message to all hubs connected to the gateways. */
   broadcastToHubsRelayed(message: Message) {
      // this._hubConnection.invoke('BroadcastToHubsRelayed', message);
   }

   /** Sends a broadcast message to connected gateways. */
   broadcastToGateways(message: Message) {
      // this._hubConnection.invoke('BroadcastToGateways', message);
   }

   // sendMessage(message: Message) {
   //    this._hubConnection.invoke('Broadcast', message);
   // }

   // sendMessageToHubs(message: Message) {
   //    this._hubConnection.invoke('BroadcastToHubs', message);
   // }

   connectToPeer(id: number) {
      // this._hubConnection.invoke('ConnectToPeer', id);
   }

   disconnectToPeer(id: number) {
      // this._hubConnection.invoke('DisconnectToPeer', id);
   }

   private createConnection() {
      // this._hubConnection = new HubConnectionBuilder()
      //    // .withUrl(window.location.href + 'ws')
      //    .withUrl('http://localhost:9912/ws')
      //    .build();
   }

   private startConnection(): void {
      // this._hubConnection
      //    .start()
      //    .then(() => {
      //       this.connectionIsEstablished = true;
      //       console.log('Hub connection started');
      //       this.connectionEstablished.emit(true);
      //    })
      //    .catch(err => {
      //       console.log('Error while establishing connection, retrying...');
      //       setTimeout(function () { this.startConnection(); }, 5000);
      //    });
   }

   private registerOnServerEvents(): void {
      // this._hubConnection.on('Event', (data: any) => {

      //    console.log('DATA:', data);

      //    this.eventReceived.emit(data);
      // });
   }
}
