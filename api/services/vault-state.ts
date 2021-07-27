// class VaultState {

import { ISetting } from "../data/models/setting";
// import PubSub from 'pubsub-js';

//   /** Reads the previous persisted state. */
//   private initialize() {

//   }

//   #apiKey: string = '';

//   get apiKey(): string {
//     return this.#apiKey;
//   }

//   set apiKey(value: string) {
//     this.#apiKey = value;
//     // localStorage.setItem('DataVault:ApiKey', value);
//   }
// }

// module.exports = new VaultState();

// Logger.ts
class VaultState {

  // #apikey: string = '';

  // get apikey(): string {
  //   return this.#apikey;
  // }

  // set apikey(value: string) {
  //   this.#apikey = value;
  //   // localStorage.setItem('DataVault:ApiKey', value);
  // }

  // constructor() {
  //   PubSub.subscribe('server-replaced', async (msg: any, data: any) => {
  //     console.log('YEEH!!!');
  //     console.log(data);
  //     this.apiKey = data.apiKey;
  //   });
  // }

  apiKey: string | undefined;

  settings: ISetting | undefined;

  // private logs: object[]
  // // Make the constructor public
  // constructor() {
  //   this.logs = []
  // }
  // get count(): number {
  //   return this.logs.length
  // }
  // log(message: string) {
  //   const timestamp: string = new Date().toISOString()
  //   this.logs.push(
  //     { message, timestamp }
  //   )
  //   console.log(`${timestamp} - ${message}`)
  // }
}

// Export a new Instance of the Logger class
export const state = new VaultState();