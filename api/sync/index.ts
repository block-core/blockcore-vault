import cluster from 'cluster';
import http from 'http';
import { cpus } from 'os';
import process, { mainModule } from 'process';
import express from 'express';
import { log } from '../services/logger';
import { config } from '../config';
import { syncEvents, getServers } from '../services/sync';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const argv = yargs(hideBin(process.argv)).argv;
const port = argv.port || 5001;
const DEV = argv.dev || true;
const db = argv['MONGODB_URL'] || 'mongodb://localhost:27017/BlockcoreVault';

async function main() {
    log.info('Arguments:', argv);

    if (cluster.isPrimary) {

        // Retrieve the total list of servers from the database.
        let servers = null;

        // Is this needed?
        mongoose.Promise = global.Promise;

        mongoose.set('toJSON', {
            virtuals: true,
            transform: (doc: any, converted: { id: any, _id: any; }) => {
                delete converted._id;
            }
        });

        log.info('Connect to:', db);

        mongoose
            .connect(db,
                {
                    autoIndex: DEV,
                    keepAlive: 1,
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
            .then(async () => {
                // log.info('Connected to DB in background. Starting sync in 5 seconds...');
                // setTimeout((arg) => {
                //     syncInterval(arg);
                // }, 5000, 'argument');

                // await seed();
                // await main();
            })
            .catch((err: any) => {
                log.error("Error connecting to DB: ", err);
            })

        try {
            servers = await getServers();
        }
        catch (err) {
            console.error('Failed to get servers', err);
        }

        log.info('Servers to start sync process for: ', JSON.stringify(servers));

        const workers = servers.map((s: any) => { return { server: s } });

        // const workers: any = [{
        //     server: { 'id': 'did:is:PF5HvaUK4nMi1vvzphTLoXU2P6vyHWYvXT', 'url': 'http://localhost:3003', 'name': 'Vault #1' }
        // },
        // {
        //     server: { 'id': 'did:is:PG5HvaUK4nMi1vvzphTLoXU2P6vyHWYvXT', 'url': 'http://localhost:3004', 'name': 'Vault #2' }
        // }];

        // The primary instance will host API that allows adding or removing active sync instances.
        const app = express();

        app.get('/add', (req: any, res: { send: (arg0: string) => void; }) => {
            res.send('An server was added.');

            const server = { 'id': 'did:is:PK5HvaUK4nMi1vvzphTLoXU2P6vyHWYvXT', 'url': 'http://localhost:3005', 'name': 'Vault #3' };
            const process = forkServer(server);

            const worker = { server, process };
            workers.push(worker);
        });

        app.get('/remove/:id', (req: any, res: any) => {
            console.log("Remove ID: " + req.params.id);
            const index = workers.findIndex((w: { server: { id: any; }; }) => w.server.id == req.params.id);
            // console.log('INDEX:', index);

            if (index > -1) {
                const server = workers[index];
                // console.log(server);
                // console.log(JSON.stringify(server));
                server.process.kill();
                workers.splice(index, 1);
                res.sendStatus(410);
            } else {
                res.sendStatus(404);
            }
        });

        app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
            res.send('Blockcore Vault Sync API');
        });

        app.listen(port, () => {
            console.log(`Sync listening on port ${port}`);
        });

        console.log(`Number of sync instances is ${workers.length}.`);
        console.log(`Primary ${process.pid} is running.`);
        
        for (let i = 0; i < workers.length; i++) {
            const worker = workers[i];
            const server = worker.server;
            worker.process = forkServer(server);
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died. Sync for one of the vaults must be restarted.`);
            console.log('WORKER:', JSON.stringify(worker));

            // if (code == '5') {
            //     console.log('The exit was requested by the API.');
            // }
            // else {
            //     console.log('Unknown exit code', code);
            //     // TODO: Add ability to restart a specific sync instance.
            //     //cluster.fork();
            // }
        });
    } else {
        const server = {
            id: process.env['SERVER_ID'],
            name: process.env['SERVER_NAME'],
            url: process.env['SERVER_URL']
        };

        log.info('Blockcore Vault: Sync Service Started.');
        log.info('Config:');
        log.info(JSON.stringify(config));
        log.info(`Server: ${server.name}`);
        log.info(`Worker: ${process.pid}`);

        // Is this needed?
        mongoose.Promise = global.Promise;

        mongoose.set('toJSON', {
            virtuals: true,
            transform: (doc: any, converted: { id: any, _id: any; }) => {
                delete converted._id;
            }
        });

        mongoose
            .connect(db,
                {
                    autoIndex: DEV,
                    keepAlive: 1,
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
            .then(async () => {
                log.info('Connected to DB in background. Starting sync in 5 seconds...');
                setTimeout((arg) => {
                    syncInterval(arg);
                }, 5000, 'argument');

                // await seed();
                // await main();
            })
            .catch((err: any) => {
                log.error("Error connecting to DB: ", err);
            })

        // async function syncInterval(arg: any) {
        //     console.log('Interval run for: ', server.name);
        //     setTimeout((arg) => {
        //         syncInterval(arg)
        //     }, 5000, 'funky');
        // }

        // setTimeout((arg) => {
        //     syncInterval(arg);
        // }, 5000, 'argument');

        syncInterval(null);

        //   app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
        //     res.send('Hello World!');
        //   });

        //   app.get('/api/:n', function (req: { params: { n: string; }; }, res: { send: (arg0: string) => void; }) {
        //     let n = parseInt(req.params.n);
        //     let count = 0;

        //     if (n > 5000000000) n = 5000000000;

        //     for (let i = 0; i <= n; i++) {
        //       count += i;
        //     }

        //     res.send(`Final count is ${count}`);
        //   })

        //   app.listen(port, () => {
        //     console.log(`App listening on port ${port}`);
        //   })
    }
}

(async () => {
    try {
        var text = await main();
        console.log(text);
    } catch (e) {
        // Deal with the fact the chain failed
        console.error('FATAL: Sync async operation has failed.');
    }
})();

function forkServer(server: any) {
    var worker_env: any = {};
    worker_env["SERVER_ID"] = server.id;
    worker_env["SERVER_NAME"] = server.name;
    worker_env["SERVER_URL"] = server.url;
    return cluster.fork(worker_env);
}

async function syncInterval(arg: any) {
    log.info('Sync interval starting...');
    // console.log(`arg was => ${arg}`);

    // Get all servers on each interval.
    const servers = await getServers();
    // console.log('Servers:', servers);

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
    setTimeout(syncInterval, 10000, 'funky');
}
