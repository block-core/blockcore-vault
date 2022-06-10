import express from "express";
import { Vault } from "./data/models";
import { Server, IServer } from './data/models';
import { routes } from "./routes";
import { OperationRequest } from "./data/models/operation-request";
import { log } from './services/logger';
import PubSub from 'pubsub-js';
import { EventResponse, Paged, SyncState } from './types';
import { processOperation } from "./controllers/identity";
import { ISetting, Setting } from "./data/models/setting";
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { state } from './services/vault-state';
import { config } from './config';

const compression = require('compression');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const https = require('https');
const app = express();
const DEV = true;
const cors = require('cors');
const path = require('path');
const bent = require('bent');
const getJSON = bent('json');

console.log(`Starting Blockcore Vault on port ${process.env.PORT}.`);

const {
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');

app.use(cors());
app.use(express.json());

app.use(
  compression({
    threshold: 512
  })
);

// expose package.json to APIs
// app.use(function (req, res, next) {
//   // res.locals.pkg = pkg;
//   res.locals.env = config;
//   next();
// });

// app.use(express.urlencoded());
app.disable('x-powered-by');

// if (config.environment === 'development') {
//   app.locals.pretty = true;
// }

// Is this needed?
mongoose.Promise = global.Promise;

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc: any, converted: { id: any, _id: any; }) => {
    delete converted._id;
  }
});

mongoose
  .connect(config.db,
    {
      autoIndex: DEV,
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  .then(async () => {
    log.info('Connected to DB');

    await seed();
    await main();
  })
  .catch((err: any) => {
    log.error("Error connecting to DB: ", err);
  })

routes.forEach((route) => {
  const { method, path, middleware, handler } = route;
  app[method](path, ...middleware, handler);
});

console.log(__dirname);

var optionsUI = {
  explorer: true,
  // customCss: '.swagger-ui .topbar { display: none }'
  // customCssUrl: '/custom.css'
  // customJs: '/custom.js'
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blockcore Vault API",
      version: "0.0.8",
      description: "Vault REST API for decentralized identity (DID) and verifiable credentials (VC) storage and retrieval.",
      termsOfService: "https://github.com/block-core/blockcore-vault",
      contact: {
        name: "Blockcore",
        url: "https://www.blockcore.net",
        email: "post@blockcore.net",
      },
    },
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Vault-Api-Key'
        }
      }
    },
    security: [{
      apiKeyAuth: []
    }]
  },
  apis: ["./build/controllers/*.js"]
};

const specs = swaggerJsDoc(options);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs, optionsUI));

app.use('/', express.static(path.join(__dirname, "ui")));

// For every url request we send our index.html file to the route
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "ui", "index.html"));
});

app.listen(config.port, () => {
  log.info(`Blockcore Vault @ http://localhost:${config.port}`);
});

var token = PubSub.subscribe('server-created', async (msg: any, data: any) => {
  // TODO: Implement auth request with trusted vaults.
  log.info('Server was created, first send authentication request (TODO).');
  log.info(`Connect with Web Sockets to the server at ${data.ws}.`);
  //connectToServer(data);
  await syncEvents(data);
});

var token2 = PubSub.subscribe('server-replaced', async (msg: any, data: any) => {
  log.info('server-replaced was triggered');
  // log.info('server-replaced: msg:', msg);
  // log.info('server-replaced: data:', data);
  // Trigger a sync whenever the server is updated.
  await syncEvents(data);
});

// const wss = new WebSocket.Server({ port: config.ws });

// wss.on('connection', function connection(ws: { on: (arg0: string, arg1: (message: any) => void) => void; send: (arg0: string) => void; }) {

//   // This is incoming connection messages, the peer that connects is responsible for handshaking the sync status.
//   ws.on('message', async (message) => {
//     const json = JSON.parse(message);

//     if (json.type === 'event') {
//       log.info(`Received: ${json.payload.type} - ${json.payload.operation} - ${json.payload.sequence} - ${json.payload.id}`);
//       log.info(JSON.stringify(json));

//       // Process the JWT, don't trust the other data.
//       processOperation({
//         sync: true,
//         ...json.payload
//       });

//     } else if (json.type === 'sync') {

//       const received = json.last.received;
//       const id = json.last.id;
//       const sequence = json.last.sequence;

//       // Check if we have the document locally.
//       // If we don't have it, we'll simply remove 1 day from the received date, and 
//       // start sending all those documents.

//       // First verify that we have the document.
//       var lastSyncedEvent = await OperationRequest.findOne({ received: received, id: id, sequence: sequence });

//       var cursor;

//       if (!lastSyncedEvent) {
//         // TODO: need to verify what happens when error is throw on this ws library.
//         // TODO: We should probably send a structured JSON object back that contains this error message and error code so it can be handled.
//         // TODO: Until we implement retry with invalid document, we will simply log error and start from genesis.
//         // throw Error('You attempted to sync based on an non-existing entry. Cannot continue. Please retry with another document or empty to sync from genesis.');
//         log.error('Client attempted to sync based on an non-existing entry. Will sync from genesis.');

//         cursor = OperationRequest.find().cursor();
//       }
//       else {
//         var minimumObjectId = new mongoose.Types.ObjectId(lastSyncedEvent._id);

//         // Get a cursor for all operations after the ID of last sync event:
//         cursor = OperationRequest.find({ _id: { $gt: minimumObjectId } }).cursor();
//       }

//       cursor.on('data', function (event: any) {
//         //console.log(event);
//         log.info(`Sending operation with sequence ${event.sequence} and ID ${event.id}.`);

//         ws.send(JSON.stringify({
//           type: 'event',
//           payload: event
//         }));
//       });

//       cursor.on('close', function () {
//         log.info('Finished sending to client.');
//         ws.send(JSON.stringify({ type: 'sync-completed' }));
//       });
//     };
//   });

//   ws.send(JSON.stringify({ status: 'You have connected to this server.' }));
// });

async function seed() {
  // First delete all vaults 
  await Vault.deleteMany({})

  // Create two users
  const smith = await Vault.create({
    id: 'did:is:test1',
    name: 'TEST1',
    url: 'http://localhost',
    created: new Date()
  })

  const adam = await Vault.create({
    id: 'did:is:test2',
    name: 'TEST2',
    url: 'http://localhost',
    created: new Date()
  })

  let setting: any = await Setting.findOne({ id: '1' });

  if (!setting) {
    let apiKey = uuidv4();

    // If the ApiKey is specified in ENV, we'll use that on startup.
    if (process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    }

    var standard = {
      id: '1',
      allowIncomingRequests: true,
      allowVaultCreateRequests: true,
      allowVaultUpdateRequests: true,
      apiKey: apiKey
    };

    setting = await Setting.create(standard);
  }

  // Update the in-memory state with the apikey.
  state.apiKey = setting.apiKey;
  state.settings = setting;

  log.info(`Your Management API Key is: ${state.apiKey}`);
  log.info('Vault State Settings:');
  log.info(JSON.stringify(state));
}

const syncpeers = [];

async function main() {
  const servers = await Server.find({ self: null, enabled: true });

  for (var index in servers) {
    var server = servers[index];
    // connectToServer(server);
  }
}

const syncEvents = async (server: IServer) => {
  log.debug(server);
  var url = server.url;
  var response = await getJSON(`${url}/event/count`);
  var count = response.count;
  log.info(`Count on ${server.name} is currently ${count}.`);

  // If the last count we saved is different than the one we just queried, we'll download new events.
  if (count != null && count != server.last.count) {

    const limit = config.sync.limit;
    let page = 1;

    log.info(`Server Last Count: ${server.last.count}`);

    // If we have a previous count persisted, used that to find which page we should continue sync on.
    if (server.last.count) {
      page = Math.floor(server.last.count / limit); // This can give decimals, so make sure we always round down.
    }

    // let page = count / limit;
    let loop = true;

    while (loop) {

      // Sync events until the returned amount if less than the limit, that means we're at the last page.
      let dataUrl = `${url}/event?page=${page}&limit=${limit}`;
      log.info(dataUrl);
      let events: Paged<EventResponse> = await getJSON(dataUrl);

      // Save the events to our database.
      for (const entry of events.data) {
        log.info(JSON.stringify(entry));
        // Process the JWT, don't trust the other data.

        try {
          await processOperation({
            sync: true,
            ...entry
          });
        } catch (err) {
          log.error('Error during event sync: ' + err.message);
        }
      }

      // This means we're on the last page.
      if (!events.data.length || events.data.length != limit) {
        log.info('Last page retrieved from server. Saving the last state until next iteration.');

        loop = false;

        // Get the latest entity from storage.
        const serverToUpdate = await Server.findOne({ id: server.id });

        log.info('Updating server...');
        log.info(serverToUpdate);

        if (serverToUpdate) {
          serverToUpdate.state = "online";
          serverToUpdate.error = '';
          serverToUpdate.lastSync = new Date();
          serverToUpdate.last.count = count;
          serverToUpdate.last.page = page;
          serverToUpdate.last.limit = limit;
          await serverToUpdate.save();
        }
      }

      page++;
    }
  }
  else {
    log.info(`The count for ${server.name} is ${count} which is same as before, or null.`);
  }

  log.info('Finished sync with vault');
};

// const connectToServer = (server: IServer) => {

//   // TODO: Temporarily disabled while working on REST API sync.
//   return;

//   log.debug(server);
//   const ws = new WebSocket(server.ws);

//   const syncState: SyncState = {
//     server: server,
//     countReceived: 0,
//     countSent: 0
//   };

//   // Keep an sync state instance on the WebSocket to manage the sync-state.
//   ws.state = syncState;

//   ws.on('open', async () => {
//     ws.send(JSON.stringify({ status: 'Connection' }));

//     // Get the latest entity from storage.
//     const serverToUpdate = await Server.findOne({ id: ws.server.id });

//     log.info('Updating server...');
//     log.info(serverToUpdate);

//     if (serverToUpdate) {
//       serverToUpdate.state = "online";
//       serverToUpdate.error = '';
//       await serverToUpdate.save();
//     }


//     // After we have recognized the server as online, we'll start sending our latest sync status:
//     // ws.send(JSON.stringify({
//     //   type: 'sync',
//     //   last: {
//     //     id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
//     //     received: '2021-05-07T17:58:22.022+00:00',
//     //     sequence: 0
//     //   }
//     // }));

//     // Set the syncStart, which we will use after getting documents from server.
//     ws.state.syncStart = new Date();

//     ws.send(JSON.stringify({
//       type: 'sync',
//       last: {
//         id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
//         received: '2021-05-07T17:58:22.022+00:00',
//         sequence: 1
//       }
//     }));

//   });

//   ws.on('message', async (data: any) => {

//     log.debug(data);
//     var json = JSON.parse(data);

//     if (json.type === 'sync-completed') {
//       log.info(`The sync with ${ws.server.name} has completed, saving the last state.`);
//       log.info(`Documents received from server, count: ${ws.state.countReceived}`);

//       // Keep the previous last sync so we can run sync.
//       const previousLastSync = ws.server.lastSync;

//       // Now we start sending all documents we received while being disconnected from the server.
//       // First verify that we have the document.
//       var lastSyncedEvent = await OperationRequest.findOne({ received: { $lt: previousLastSync } });

//       var cursor;

//       if (!lastSyncedEvent) {
//         log.error('Did not find last sync event. Will sync from genesis.');
//         cursor = OperationRequest.find().cursor();
//       }
//       else {
//         var minimumObjectId = new mongoose.Types.ObjectId(lastSyncedEvent._id);

//         // Get a cursor for all operations after the previous last sync up until the documents we just received from the server.
//         cursor = OperationRequest.find({ _id: { $gt: minimumObjectId }, received: { $lt: ws.state.syncStart } }).cursor();
//       }

//       cursor.on('data', function (event: any) {
//         //console.log(event);
//         log.info(`Sending operation with sequence ${event.sequence} and ID ${event.id}.`);

//         ws.send(JSON.stringify({
//           type: 'event',
//           payload: event
//         }));

//         ++ws.state.countSent;
//       });

//       cursor.on('close', function () {
//         log.info(`Documents sent to server, count: ${ws.state.countSent}`);

//         // Now we save the server so the .last state is persisted.
//         // We wait with this until sync has completed both ways, or else we might loose track if sync stops/disconnects/crashes.
//         // Resyncing the same items multiple times is not a problem, but a bigger problem if we don't sync and loose some data.
//         ws.server.lastSync = new Date();
//         ws.server.save();
//         log.debug(ws.server);

//         // We don't really need to send any sync completed to the server, do we? Clients are responsible for keeping sync state, not servers.
//         // ws.send(JSON.stringify({ type: 'sync-completed' }));
//       });
//     } else if (json.type === 'event') {
//       // log.info('Received event with payload: ' + JSON.stringify(json.payload));
//       log.info(`Received: ${json.payload.type} - ${json.payload.operation} - ${json.payload.sequence} - ${json.payload.id}`);

//       // Verify if this works?
//       ++ws.state.countReceived;
//       log.info('Received Count: ' + ws.state.countReceived);

//       // Update the last documented synced.
//       ws.server.last = {
//         id: json.payload.id,
//         received: json.payload.received,
//         sequence: json.payload.sequence
//       };
//     }
//   });

//   ws.on('close', async () => {
//     log.warn('disconnected');

//     const serverToUpdate = await Server.findOne({ id: ws.server.id });

//     if (serverToUpdate) {
//       serverToUpdate.state = 'offline';
//       serverToUpdate.error = '';
//       await serverToUpdate.save();
//     }

//   });

//   ws.on('error', async (err: any, server: any) => {
//     log.error(err);
//     log.error(ws.server);

//     const serverToUpdate = await Server.findOne({ id: ws.server.id });

//     if (serverToUpdate) {

//       // Just an example, likely need to add various handling here.
//       if (err.code == 'ECONNREFUSED') {
//         serverToUpdate.state = 'error';
//       }
//       else {
//         serverToUpdate.state = 'error';
//       }

//       serverToUpdate.error = err.code;
//       await serverToUpdate.save();
//     }

//     //console.error(e.code);
//   });

//   // Keep a reference to the server so we can update status.
//   ws.server = server;

//   // const peer = {
//   //   server,
//   //   ws
//   // };

//   syncpeers.push(ws);
// };