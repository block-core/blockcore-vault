import 'dotenv/config';
import express from 'express';
import path from 'path';
import url from 'url';
import cors from 'cors';
import compression from 'cors';
import cookie from 'cookie-parser';
import cache from 'memory-cache';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { log } from './services/logger';
import { Server } from './server';
import { SyncProcess } from './sync';
import { v4 as uuidv4 } from 'uuid';
// import HTTPMethod from 'http-method-enum';
import HTTP_STATUS_CODES from 'http-status-enum';
// import { verifyJWT } from 'did-jwt';

const production = process.env['NODE_ENV'] === 'production';
const rateLimitMinute = process.env['RATELIMIT'] ? Number(process.env['RATELIMIT']) : 30;
const port = process.env['PORT'] ? Number(process.env['PORT']) : 4250;
const syncInterval = process.env['SYNC_INTERVAL'] ? Number(process.env['SYNC_INTERVAL']) : 60;
const maxsize = process.env['MAXSIZE'] ?? '16kb';
const didMethod = process.env['DID_METHOD'] ?? 'did:is';
const database = process.env['DATABASE'];
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)); // const __filename = url.fileURLToPath(import.meta.url);
const root = path.join(__dirname, '..', 'ui', 'dist');
const key = process.env['JWT_KEY'];

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
app.use(cookie());
app.use(
	compression({
		threshold: 512,
	})
);

app.disable('x-powered-by');

app.get('/1.0/authenticate', (_req, res) => {
	const challenge = uuidv4();

	// Put the challenge in cache for 5 minute.
	cache.put(`challenge:${challenge}`, true, 60 * 1000);

	res.send({ challenge: challenge });
});

app.get('/1.0/authenticate/protected', (req, res) => {
	const { cookies } = req;
	const token = cookies.token;

	if (!token) {
		return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
			status: 'error',
			error: 'Unauthorized',
		});
	} else {
		// First let us verify the token.
		const decoded = jwt.verify(token, key);
		console.log(decoded);

		return res.status(HTTP_STATUS_CODES.OK).json({
			user: {
				did: decoded.did,
			},
		});
	}
});

app.get('/1.0/authenticate/logout', (req, res) => {
	const { cookies } = req;
	const jwt = cookies.token;

	if (!jwt) {
		return res.status(401).json({
			status: 'error',
			error: 'Unauthorized',
		});
	}

	const serialized = serialize('token', null, {
		httpOnly: true,
		secure: production,
		sameSite: 'strict',
		maxAge: -1,
		path: '/',
	});
	res.setHeader('Set-Cookie', serialized);

	return res.status(200).json({
		status: 'success',
		message: 'Logged out',
	});

	// res.send({ logout: true });
});

app.post(
	'/1.0/authenticate',
	asyncHandler(async (req, res) => {
		if (!req.body.proof) {
			return res.status(404);
		}

		await server.verifyToken(req.body.proof, req.body.did);

		const payload = {
			did: req.body.did,
		};

		const token = jwt.sign(payload, key);

		console.log('AUTH TOKEN:', token);

		// If the verification failed, it should have thrown an exception by now. We can generate an JWT and make a cookie for it.
		const serialized = serialize('token', token, {
			httpOnly: true,
			secure: production,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30,
			path: '/',
		});

		console.log('COOKIE:', serialized);

		res.setHeader('Set-Cookie', serialized);

		return res.status(HTTP_STATUS_CODES.OK).json({
			success: true,
			user: {
				did: payload.did,
			},
		});
	})
);

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
