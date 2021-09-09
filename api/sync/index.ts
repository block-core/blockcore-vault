import { log } from '../services/logger';
import { config } from '../config';
import { syncEvents, getServers } from '../services/sync';
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const DEV = true;

var done: any = (function wait() { if (!done) setTimeout(wait, 1000) })();

log.info('Blockcore Vault: Sync Service Started.');
log.info('Config:');
log.info(JSON.stringify(config));

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
        log.info('Connected to DB in background');
        setTimeout(syncInterval, 5000, 'argument');

        // await seed();
        // await main();
    })
    .catch((err: any) => {
        log.error("Error connecting to DB: ", err);
    })

async function syncInterval(arg: any) {
    log.info('Sync interval starting...');
    // console.log(`arg was => ${arg}`);

    // Get all servers on each interval.
    const servers = await getServers();
    console.log('Servers:', servers);

    for (let i = 0; i < servers.length; i++) {

        let server = servers[i];

        if (server.self) {
            continue;
        }

        log.info('Running sync on: ' + JSON.stringify(server));
        await syncEvents(server);
    }

    // servers.forEach(async (server: any) => {

    //     if (server.self) {
    //         break;
    //     }

    // });

    // for (var server in servers) {
    //     // var server = servers[index];
    // }

    log.info('Sync interval completed.');
    setTimeout(syncInterval, 5000, 'funky');
}


