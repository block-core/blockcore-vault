import cluster from 'cluster';
import http from 'http';
import { cpus } from 'os';
import process from 'process';
import express from 'express';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;
const numCPUs = argv.instances || cpus().length;
const port = argv.port || 5000;

if (cluster.isPrimary) {
  console.log(`Number of instances is ${numCPUs}.`);
  console.log(`Primary ${process.pid} is running.`);
  console.log('Arguments:', argv);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died. New will be forked immediately.`);
    cluster.fork();
  });
} else {
  const app = express();
  console.log(`Worker ${process.pid} started`);

  app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
    res.send('Hello World!');
  });

  app.get('/api/:n', function (req: { params: { n: string; }; }, res: { send: (arg0: string) => void; }) {
    let n = parseInt(req.params.n);
    let count = 0;

    if (n > 5000000000) n = 5000000000;

    for (let i = 0; i <= n; i++) {
      count += i;
    }

    res.send(`Final count is ${count}`);
  })

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  })
}
