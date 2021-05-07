import express from "express";
import { IVault, Vault } from "./data/models";
import { Populated, Select } from "./data/mongoose";
import { Server, IServer } from './data/models';
import { routes } from "./routes";
const compression = require('compression');
// const env = process.env.NODE_ENV || 'development';
const pkg = require('./package.json');
const config = require('./config');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const WebSocket = require('ws');

const app = express();
const DEV = true;

app.use(express.json());

app.use(
  compression({
    threshold: 512
  })
);

console.log(config);

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
    console.log("Connected to DB");
    await seed();
    await main();
  })
  .catch((err: any) => console.error("Error connecting to DB: ", err))

routes.forEach((route) => {
  const { method, path, middleware, handler } = route;
  app[method](path, ...middleware, handler);
});

app.listen(config.port, () => {
  console.log(`Blockcore Vault @ http://localhost:${config.port}`);
});

const wss = new WebSocket.Server({ port: config.ws });

wss.on('connection', function connection(ws: { on: (arg0: string, arg1: (message: any) => void) => void; send: (arg0: string) => void; }) {

  // This is incoming connection messages, the peer that connects is responsible for handshaking the sync status.
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);


    if (message.type == 'sync') {

    }



  });

  ws.send('something');
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

    console.log(server);

    const ws = new WebSocket(server.ws);

    ws.on('open', async () => {
      ws.send('something');



      const serverToUpdate = await Server.findOne({ id: ws.server.id });

      console.log('Updating server...');
      console.log(serverToUpdate);

      if (serverToUpdate) {
        serverToUpdate.state = "online";
        serverToUpdate.error = '';
        await serverToUpdate.save();
      }

    });

    ws.on('message', function incoming(data: any) {
      console.log(data);



    });

    ws.on('close', async () => {
      console.log('disconnected');

      const serverToUpdate = await Server.findOne({ id: ws.server.id });

      if (serverToUpdate) {
        serverToUpdate.state = 'offline';
        serverToUpdate.error = '';
        await serverToUpdate.save();
      }

    });

    ws.on('error', async (err: any, server: any) => {
      console.error('error!');
      console.error(err);
      console.log(ws.server);

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