import test from 'ava';
import { didNotFound, Server } from '../src/server.js';

test('Validate the CID (Content ID) implementation', async (t) => {
	const server = new Server();
	t.assert(server != null);

	const cid1 = await server.generateCid({ id: '1' });
	const cid2 = await server.generateCid({ id: '1' });

	t.assert(cid1.toString() == cid2.toString());

	const cid3 = server.parseCid(cid1.toString());
	t.assert(cid1.equals(cid3));

	t.assert(server.parseCid('bafyreibmc4xb7biwqftfnpoaeiymjvucqogn2u5tnagrwdgzgcwxdidg3q').equals(cid1));
});
