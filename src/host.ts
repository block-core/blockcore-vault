import 'dotenv/config';
import express from 'express';
import path from 'path';
import url from 'url';
import cors from 'cors';
import compression from 'cors';
import rateLimit from 'express-rate-limit';
import { log } from './services/logger';
import { Server } from './server';
import { SyncProcess } from './sync';

const rateLimitMinute = process.env['RATELIMIT'] ? Number(process.env['RATELIMIT']) : 30;
const port = process.env['PORT'] ? Number(process.env['PORT']) : 4250;
const syncInterval = process.env['SYNC_INTERVAL'] ? Number(process.env['SYNC_INTERVAL']) : 60;
const maxsize = process.env['MAXSIZE'] ?? '16kb';
const didMethod = process.env['DID_METHOD'] ?? 'did:is';
const database = process.env['DATABASE'];
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)); // const __filename = url.fileURLToPath(import.meta.url);
const root = path.join(__dirname, '..', 'ui', 'dist');

log.info(`RATE LIMIT: ${rateLimitMinute} rpm`);
log.info(`MAX SIZE: ${maxsize}`);

const server = new Server(database, didMethod);
await server.start();

async function shutdown(signal: any) {
	log.info(`*^!@4=> Received signal to terminate: ${signal}`);
	// console.log(`*^!@4=> Received signal to terminate: ${signal}`);
	await server.stop();
	process.kill(process.pid, signal);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

log.info(`Blockcore Vault starting on port ${port}.`);

const app = express();

const asyncHandler = (fun) => (req, res, next) => {
	Promise.resolve(fun(req, res, next)).catch(next);
};

const asyncFunc = (text) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(text), 1000);
	});
};

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: rateLimitMinute,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Apply the rate limiting middleware to API calls only
// app.use('/api', apiLimiter)

app.use(cors());
app.use(express.json());
app.use(
	compression({
		threshold: 512,
	})
);

app.disable('x-powered-by');

app.post(
	'/',
	asyncHandler(async (req, res) => {
		const response = await server.request(req.body);
		return res.send(response);
		// const result1 = await asyncFunc('Hello,');
		// const [result2, result3] = await Promise.all([asyncFunc('Mr'), asyncFunc('World')]);
		// const result = `${result1} ${result2} ${result3}`;
		// return res.send(result);
	})
);

app.use('/', express.static(root));

app.get(
	'/',
	asyncHandler(async (_req, res) => {
		const result1 = await asyncFunc('Hello,');
		const [result2, result3] = await Promise.all([asyncFunc('Mr'), asyncFunc('World')]);
		const result = `${result1} ${result2} ${result3}`;
		return res.send(result);
	})
);

// For every url request we send our index.html file to the route
app.get('/*', (_req, res) => {
	res.sendFile(path.join(root, 'index.html'));
});

let sync: SyncProcess;

const syncFunction = async () => {
	if (sync == null) {
		sync = new SyncProcess(server, process.env['SERVERS']);
	}

	try {
		await sync.run();
	} catch (err: any) {
		console.error(`Failure during sync: ${err.message}`);
	}

	setTimeout(() => {
		syncFunction();
	}, syncInterval * 1000);
};

try {
	// Run the HTTP server that responds to queries.
	app.listen(port, () => {
		log.info(`Blockcore Vault running on http://localhost:${port}`);
	});

	// Run the SYNC service that ensures data is synced cross server instances.
	syncFunction();
} catch (error) {
	const serializedError = JSON.stringify(error, Object.getOwnPropertyNames(error));
	console.log(`Blockcore Vault initialization failed with error ${serializedError}`);
	process.exit(1);
}

// // router.get('/.well-known/did-configuration.json', async (ctx, _next) => {
// // 	const configuration = {
// // 		'@context': 'https://identity.foundation/.well-known/did-configuration/v1',
// // 		linked_dids: [process.env['VC']],
// // 	};

// // 	setResponse(configuration, ctx.response, 200);
// // });

// // router.get('/1.0/log/:sequence', async (ctx, _next) => {
// // 	try {
// // 		const sequence = Number(ctx.params['sequence']);
// // 		const items = await server.list(sequence);
// // 		setResponse(items, ctx.response, 200);
// // 	} catch (err: any) {
// // 		setResponse({ error: err.message }, ctx.response, 500);
// // 	}
// // });

// // router.get('/1.0/identifiers/:did', async (ctx, _next) => {
// // 	try {
// // 		// ctx.request.ip
// // 		let versionId: number | undefined;

// // 		if (ctx.query['versionId']) {
// // 			versionId = Number(ctx.query['versionId']);
// // 		}

// // 		const did = String(ctx.params['did']);

// // 		const resolution = await server.resolve(did, versionId);
// // 		setResponse(resolution.result, ctx.response, resolution.status);
// // 	} catch (err: any) {
// // 		setResponse({ didDocument: null, didDocumentMetadata: {}, didResolutionMetadata: { error: 'internalError', description: err.message } }, ctx.response, 500);
// // 	}
// // });

// // router.get('/wipe', async (ctx, _next) => {
// // 	await server.wipe();
// // 	setResponse({ wipe: 'ok' }, ctx.response);
// // });

// // router.get('/', async (ctx, _next) => {
// // 	setResponse({ online: 'true', wellKnown: '/.well-known/did-configuration.json', example: '/1.0/identifiers/did:is:0f254e55a2633d468e92aa7dd5a76c0c9101fab8e282c8c20b3fefde0d68f217' }, ctx.response, 200);
// // });

// // const setResponse = (response: any, koaResponse: Koa.Response, statusCode: number) => {
// // 	koaResponse.status = statusCode;
// // 	// koaResponse.status = response.status ? response.status : 200;
// // 	koaResponse.set('Content-Type', 'application/json');
// // 	// koaResponse.body = JSON.stringify(response);
// // 	koaResponse.body = response;
// // };
