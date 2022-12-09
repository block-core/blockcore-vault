import { ServerState } from './interfaces';
import { didNotFound, Server } from './server';

export class SyncProcess {
	servers?: string[];

	constructor(private server: Server, servers: string | undefined) {
		this.servers = servers?.split(';').filter((i) => i.trim());
		console.log('DID Servers:', this.servers);
	}

	async process(server: string, state: ServerState) {
		const url = `${server}/1.0/log/${state.sequence}`;

		// Used to populate local instance of Blockcore DID Server:
		const rawResponse = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});

		const content = await rawResponse.json();

		if (content.length == 0) {
			console.log(`${server}: Sync completed.`);
			await this.server.setState(server, state);
			return;
		}

		for (let i = 0; i < content.length; i++) {
			const did = content[i].did;
			const version = content[i].ver;

			const doc = await this.server.resolve(did, version);

			if (didNotFound(doc.result)) {
				const fetchUrl = `${server}/1.0/identifiers/${did}?versionId=${version}`;

				const didResolutionResponse = await fetch(fetchUrl, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				});

				const didResolution = await didResolutionResponse.json();

				if (didResolution) {
					const jws = didResolution.didDocumentMetadata.proof.jwt;
					await this.server.request(jws);
				}
			}

			// Keep track of the last sequence:
			state.sequence = content[i].seq;
		}

		// Persist the latest sync state in case of crash during sync we won't have to check older logs.
		await this.server.setState(server, state);
		console.log(`${server}: Run sync from ${state.sequence}.`);

		// Continue processing until we're done.
		await this.process(server, state);
	}

	async run() {
		console.log(`${new Date()}: Running Sync Process...`);

		if (!this.servers || this.servers.length == 0) {
			console.log('No servers configured for sync.');
			return;
		}

		for (let i = 0; i < this.servers.length; i++) {
			const server = this.servers[i];

			if (!server) {
				continue;
			}

			let state = await this.server.getState(server);

			if (!state) {
				state = {
					date: new Date(),
					sequence: 0,
				};
			}

			console.log(`${server}: Run sync from ${state.sequence}.`);
			await this.process(server, state);
		}
	}
}
