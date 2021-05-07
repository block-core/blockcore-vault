# Blockcore Vault

Node Express app written in TypeScript.

## Setup

To set up the application, first clone the repo. Then, install the dependencies by running npm:

```bash
npm install
```

## Starting the Server

To start the server, run:

```bash
npm start
```

The server should now be running on port 3000.

## Development, Testing & Production

To run with the different environment configuration, you can set the ENV variable like this:

```sh
# Windows
set NODE_ENV=production

# PowerShell
$env:NODE_ENV="production"

# Linux/Mac
export NODE_ENV=production
```

Available options is `production`, `development`, `test`.

The different configuration is available under `./config/env/*.ts`

## Making Requests

The server has many different endpoints:

- `GET /.well-known/did.json`&mdash;Returns the DID of the server.
- `GET /.well-known/did-configuration.json`&mdash;Returns the DID Configuration of the server.
- `GET /.well-known/vault-configuration.json`&mdash;Returns the Vault Configuration of the server

- `GET /`&mdash;Returns all registered vaults.
- `POST /vault`&mdash;Adds another vault as a trusted vault to this vault.
- `DELETE /vault`&mdash;Removes another vault as a trusted vault on this vault.

The GET endpoint can be viewed simply by navigating to `http://localhost:3000`. You should see "Welcome to Blockcore Vault".


## Controllers

### Vault ("Confidential Storage") API

Allows CRUD operations over `DataVaultConfiguration`, allows a vault to have multiple parties that are allowed to post data to it.

When a new `DataVaultConfiguration` is submitted, the `storage provider` can run the Blockcore Vault software in a public and free mode or in manual approval mode, where 
individual vaults must be approved before they can be used by the `data vault controller` or `storage agent`.

Example data vault URL:

http://localhost:3000/data/z4sRgBJJLnYy

All operations on the Vault requires requests to be signed by the keys specified in the DID Document. If the software is unable to resolve the DID Document, then verification will fail and storage will not be possible.

Replication configuration is part of the vault creation operation.

Vault type should be part of the vault creation operation. Vault types could be encrypted, unencrypted, immutable, mutable, etc.

### Identity ("DID") API

Allows operations for decentralized identity (DID), including registering new DIDs, updating DID Documents and resolving DID Documents.

Example public permalink for an `did:is` (DID Method) identity profile:

https://did.is/PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd

The ID of this identity: `did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd`

### Server ("Management") API

Allows a storage provider (administrator) to register and manage trusted Blockcore Vault instances to syncronize data with.

### .well-known API

Allows for public discovery using known URLs to find DID, DID Configuration and Vault Configuration.

### Statistics ("Stats") API

Used to retrieve various metrics recorded by the Blockcore Vault instance. This can be used to analyze the usage performed by various vault contributors.

Data from this API is used to enforce throtteling rules that an administrator applies to individual vaults.

# Using Blockcore Vault

After launching the Blockcore Vault instance, you can use the Blockcore Vault UI to manage your Blockcore Vault instance(s).

The first task to configure a Blockcore Vault, is to create an decentralized identity (DID) and publish the DID Document that describes your Vault to 
an public DID registry.

After you have initialized your Blockcore Vault, you can start adding communication with other trusted Vaults to become part of a network of Vault instances.

You can run your own network of Vault instances, or join other networks.

When you connect with other Vault instances, you will always sync the full repository of DID Documents that exists on the other Vaults.

Other data will be synced based upon the configuration you setup on your Blockcore Vault UI.

## Register a trusted Vault

TODO: When you want to add trust between two Blockcore Vault, you will from the Vault UI perform queries against the URL you provide.

1. The web UI will query the .well-known/did-configuration.json of the server you provided.
2. The web UI will run call with a universal resolver that will attempt to resolve the DID Document based on the DID provided in the did-configuration.json.
3. Verification between the domain you supplied and the DID Document is performed.
4. Name of the Vault is retrieved from the .well-known/vault-configuration.json. It also has the `dataVaultCreationService` URL which might be used, or the `serviceEndpoint` of the `EncryptedDataVault` entry in the DID Document will be used. Could maybe used either or, depending on what is available. Perhaps prefer the service entry in DID Document, and fallback to vault-configuration.json which is Blockcore custom specification.
5. An initiation request to be sent to the Vault is created and signed in the web UI with the private key never leaving the local browser. The initiation request is sent and stored on the users own Vault, and is sent to the external Vault when the server is registered.
6. The users Vault will keep checking at intervals the approval status of the initiation request.
7. Upon approval (which can be automatic depending on the Vault being connected with) the Vault will open up Web Socket connection, perform authentication based on the key specified in its own DID Document.
8. Upon valid authentication, syncronization will start.

CURRENT: Currently the implementation of this is simplified and without any authentication or approval process.

## Data Sync

When an vault adds another vault, that becomes a client-server relationship. There is not a "two-way" relationship, where the server opens connection or performs data sync operations.

When the client vault connects up to a server vault (which must be accessible through firewall if on public network, client vault can be behind NAT/firewall), it will announce the last document it received from that specific server.

The server does not keep track of sync status of the connected clients, except for when a client vault announces that it is "fully synced". Upon which the server vault will begin to push all new incoming events down to the clients.

Upon connection from client to server, after authentication (To be implemented), the client sends metadata about the last event (operation) it received from the server. Upon which the server will begin looping through all events from that event and further. Each individual event will be pushed by server to the client.

When finished, the server will begin to push all new incoming events directly to the client.

Additionally when finished with initial sync from server to client, the client will begin to push all events (operations) it has received after last received event from the server. This will then ensure that the server receives all operations that the client received, while being offline/disconnected from the server.

Example:

Vault #1 (Server) has document XS1, XS2, YS1. (S = sequence/version).

Vault #2 (Client) has document XS1 and ZS1.

Upon connection, #1 will send XS2 (which has arrived later) and YS1.

When finished, #2 will send ZS1, which is received while being disconnected.

Upon finish, both vault will have XS1, XS2, YS1 and ZS1.

If Vault #1 and Vault #2 receives XS3 while being offline, then Vault #2 upon the initial sync, will ignore the XS3 that exists on Vault #1. If either vault have a higher sequence of X, e.g. XS4, then that will win and be the active document when sync has completed.

This means that two vault instances can host different instances of the same versioned document. This is considered to be a valid state, and it is intentional by the owner of that document. The owner has to make two individual operations that is submitted to two different vaults at different times, while the vaults being disconnected from each other.

## Restrictions

When a Vault has registered an outbound (client/server) relationship, the target Vault cannot register a connection back to the same Vault. This is a limitation in the software and the software should avoid such circular connections.

To setup a resilient network of Blockcore Vault instances, you need at minimum 3 instances.

Vault #1 > Vault #2 > Vault #3 > Vault #1.

Whenever an event enters any of these vaults, it will be immediately delivered to both outgoing and incoming connections. This ensures if there is some issues or drop between #3 and #1, then #1 will still receive the event from #2.

The next level of resilience, is having a total of #5 public vault instances. With 5 instances, each of them can have two outgoing and two incoming connections.

In both of these scenarios, there can be any number of non-public and incoming-only instances of Vault running and receiving data.

It is of course possible to run just a single vault instance, or a single public instance that only have clients connected.

A client vault cannot be used to enable cross-network sync. If a vault connects to two different vault network rings, it will not forward messages it receives from one server and send to another server. This is to avoid various network sync issues and trust-issues.

If a client vault receives an event, it will forward that to all registered and connected server vaults. 




# Vocabulary

- `Vault` - An instance of the Blockcore Vault software.
- `Data Vault` - An registered store of data that is hosted on Blockcore Vault software.
- `DID` - Decentralized identity.
- `DID Document` - A document that describes keys and other information about an DID Subject.
- `DID Resolver` - A library / code that allows lookup of DID Documents against an "DID Registry"/"DID Hub".
- `VC` - Verifiable Credentials, a signed JSON-document.


# TODO

## Worker Threads

Investigate if we should Worker Threads for data sync between Vaults. We should consider spawning a seperate thread pr. connected Vault, so that it won't affect the main thread.

Performance testing is important to figure out if this has any affect or not.

https://nodejs.org/api/worker_threads.html

https://github.com/uNetworking/uWebSockets.js/blob/master/examples/WorkerThreads.js
