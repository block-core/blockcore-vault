import express from "express";
import { IVault, Vault } from "./data/models";
import { Populated, Select } from "./data/mongoose";
import { Server, IServer } from './data/models';
import { routes } from "./routes";
import { OperationRequest } from "./data/models/operation-request";
const compression = require('compression');
// const env = process.env.NODE_ENV || 'development';
const pkg = require('./package.json');
const config = require('./config');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const WebSocket = require('ws');
import { log } from './services/logger';

const app = express();
const DEV = true;

app.use(express.json());

app.use(
  compression({
    threshold: 512
  })
);

log.info(config);

// expose package.json to APIs
app.use(function (req, res, next) {
  res.locals.pkg = pkg;
  res.locals.env = config;
  next();
});

// app.use(express.urlencoded());
app.disable('x-powered-by');

// const join = require('path').join;
// const models = join(__dirname, 'app/models');

// const fs = require('fs');
// fs.readdirSync(models)
//   .filter(file => ~file.search(/^[^.].*\.js$/))
//   .forEach(file => require(join(models, file)));

// A way to show custom headers, we won't expose it for security reasons.
// function customHeaders(req: any, res: any, next: any) {
//   app.disable('x-powered-by');
//   res.setHeader('X-Powered-By', 'Blockcore Vault v0.0.1');
//   next();
// }

// app.use(customHeaders);

if (config.environment === 'development') {
  app.locals.pretty = true;
}

// Is this needed?
mongoose.Promise = global.Promise;

// mongoose.set('toObject', {
//   virtuals: true,
//   transform: (doc: any, converted: { id: any, _id: any; }) => {
//     converted._id = converted.id;
//     delete converted.id;
//   }
// });

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

app.listen(config.port, () => {
  console.log(`Blockcore Vault @ http://localhost:${config.port}`);
  console.log('Check the log file on disk for more information.');
  log.info(`Blockcore Vault @ http://localhost:${config.port}`);
});

const wss = new WebSocket.Server({ port: config.ws });

wss.on('connection', function connection(ws: { on: (arg0: string, arg1: (message: any) => void) => void; send: (arg0: string) => void; }) {

  // This is incoming connection messages, the peer that connects is responsible for handshaking the sync status.
  ws.on('message', async (message) => {

    const json = JSON.parse(message);
    log.debug('received: %s', message);

    if (json.type == 'sync') {

      const received = json.last.received;
      const id = json.last.id;
      const sequence = json.last.sequence;

      // Check if we have the document locally.
      // If we don't have it, we'll simply remove 1 day from the received date, and 
      // start sending all those documents.

      // First verify that we have the document.
      var lastSyncedEvent = await OperationRequest.findOne({ received: received, id: id, sequence: sequence });

      var cursor;

      if (!lastSyncedEvent) {
        // TODO: need to verify what happens when error is throw on this ws library.
        // TODO: We should probably send a structured JSON object back that contains this error message and error code so it can be handled.
        // TODO: Until we implement retry with invalid document, we will simply log error and start from genesis.
        // throw Error('You attempted to sync based on an non-existing entry. Cannot continue. Please retry with another document or empty to sync from genesis.');
        log.error('Client attempted to sync based on an non-existing entry. Will sync from genesis.');

        cursor = OperationRequest.find().cursor();
      }
      else {
        var minimumObjectId = new mongoose.Types.ObjectId(lastSyncedEvent._id);

        // Get a cursor for all operations after the ID of last sync event:
        cursor = OperationRequest.find({ _id: { $gt: minimumObjectId } }).cursor();
      }

      cursor.on('data', function (event) {
        //console.log(event);
        log.info(`Sending operation with sequence ${event.sequence} and ID ${event.id}.`);

        ws.send(JSON.stringify({
          type: 'event',
          payload: event
        }));
      });

      cursor.on('close', function () {
        log.info('LOOPED ALL DOCUMENTS!!');
        ws.send(JSON.stringify({ type: 'sync-completed' }));
      });
    };
  });

  ws.send(JSON.stringify({ status: 'You have connected to this server.' }));
});

// const ws = new WebSocket('ws://localhost:9999/vault/sync');

// ws.on('open', function open() {
//   ws.send('something');
// });

// ws.on('message', function incoming(data: any) {
//   console.log(data);
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
    // friends: [smith.id],
    // boss: smith.id
  })
}

const syncpeers = [];

async function main() {
  // Simple query
  const adam =
    await Vault.findOne({ name: 'TEST1' })

  // Populate
  // const adamPopulated =
  //   await Vault.findOne({ email: 'adam@email.com' })
  //     .populate('friends')
  //     .populate('boss') as Populated<IVault, 'friends' | 'boss'>

  // Lean
  const adamLean =
    await Vault.findOne({ email: 'adam@email.com' })
      .lean()

  // Select
  // const adamSelect =
  //   await Vault.findOne({ email: 'adam@email.com' })
  //     .select('friends') as Select<IVault, 'friends'>

  // Instance methods
  const smith = await Vault.findOne({ email: 'smith@email.com' })
  // const smithsEmployees = await smith.getEmployees()


  const servers = await Server.find({ self: null, enabled: true });
  // console.log(servers);

  for (var index in servers) {
    var server = servers[index];

    log.debug(server);
    const ws = new WebSocket(server.ws);

    ws.on('open', async () => {
      ws.send(JSON.stringify({ status: 'Connection' }));

      const serverToUpdate = await Server.findOne({ id: ws.server.id });

      log.info('Updating server...');
      log.info(serverToUpdate);

      if (serverToUpdate) {
        serverToUpdate.state = "online";
        serverToUpdate.error = '';
        await serverToUpdate.save();
      }

      // After we have recognized the server as online, we'll start sending our latest sync status:
      // ws.send(JSON.stringify({
      //   type: 'sync',
      //   last: {
      //     id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
      //     received: '2021-05-07T17:58:22.022+00:00',
      //     sequence: 0
      //   }
      // }));
      ws.send(JSON.stringify({
        type: 'sync',
        last: {
          id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
          received: '2021-05-07T17:58:22.022+00:00',
          sequence: 1
        }
      }));

    });



    ws.on('message', function incoming(data: any) {

      log.debug(data);
      var json = JSON.parse(data);

      if (json.type === 'sync-completed') {
        log.info('THE SYNC HAS COMPLETED, UPDATE LAST STATE!');

        // Now we save the server so the .last state is persisted.
        ws.server.lastSync = new Date();
        ws.server.save();

        log.debug(ws.server);

      } else if (json.type === 'event') {
        log.info('Received event with payload: ' + JSON.stringify(json.payload));

        // Update the last documented synced.
        ws.server.last = {
          id: json.payload.id,
          received: json.payload.received,
          sequence: json.payload.sequence
        };
      }
    });

    ws.on('close', async () => {
      log.warn('disconnected');

      const serverToUpdate = await Server.findOne({ id: ws.server.id });

      if (serverToUpdate) {
        serverToUpdate.state = 'offline';
        serverToUpdate.error = '';
        await serverToUpdate.save();
      }

    });

    ws.on('error', async (err: any, server: any) => {
      log.error(err);
      log.error(ws.server);

      const serverToUpdate = await Server.findOne({ id: ws.server.id });

      if (serverToUpdate) {

        // Just an example, likely need to add various handling here.
        if (err.code == 'ECONNREFUSED') {
          serverToUpdate.state = 'error';
        }
        else {
          serverToUpdate.state = 'error';
        }

        serverToUpdate.error = err.code;
        await serverToUpdate.save();
      }

      //console.error(e.code);
    });

    // Keep a reference to the server so we can update status.
    ws.server = server;

    // const peer = {
    //   server,
    //   ws
    // };

    syncpeers.push(ws);
  }

  // console.log(syncpeers);

  // Statics
  // const usersYoungerThan23 = await Vault.findYoungerThan(23)
}