<p align="center">
  <p align="center">
    <img src="https://avatars3.githubusercontent.com/u/53176002?s=200&v=4" height="100" alt="Blockcore" />
  </p>
  <h3 align="center">
    About Blockcore Vault
  </h3>
  <p align="center">
    Verifiable Credential Server
  </p>
</p>

# Blockcore Vault

Server for Verifiable Credentials ([VC](https://www.w3.org/TR/vc-data-model/)) managed by Decentralized Identifiers ([DID](https://www.w3.org/TR/did-core/)).

## What does Blockcore Vault do?

This software provides a generic interface for storing and serving VCs in a manner that is easy to use.

## What about Decentralized Web Nodes?

DWN are the future for VC storage, but the specification is currently only in `draft` state. In preparation for a fully fledge DWN specification and implementations, the Blockcore Vault is an alternative with a simpler API interface.

Source code: [blockcore-dwn](https://github.com/block-core/blockcore-dwn)   
Specification: [decentralized-web-node](https://identity.foundation/decentralized-web-node/spec/)

![](/docs/blockcore-vault.png)

## What is Web5?

Learn more: [https://developer.tbd.website/projects/web5/](https://developer.tbd.website/projects/web5/)

Blockcore Vault is a work-in-progress and is focused on delivering implementation of open standard specifications developed by the Decentralized Identity Foundation ([DIF](https://github.com/decentralized-identity)).

The various standards are currently in development, so the Blockcore Vault will continue to be in development and change according to the specifications.

Blockcore Vault is not a reference implementation of the standards, and we have limited development resources available for implementation, so we will implement parts of the standards. We strive towards interopability with other implementations, but can't do full standard implementations without funding and support.

To learn more about the definitions and concepts, make sure you check out the [Decentralized Identity FAQ](https://identity.foundation/faq/).

## All Your Devices

Blockcore Vault will in the future be available for many devices, and all your data will flow with you across those devices. Your diplomas, tickets, receipts, messages and everything else of important data in your life, will be accessible from Blockcore Vault (or Blockcore DWN) on all your digital devices. All your data will seamlessly synchronize between your devices.

For sharing with friends, family and the public, you can rent or host your own Blockcore Vault Server in the cloud, or at home. This will allow you to share with others, data that is always accessible and online, even when you are not.

## Setup

To set up the application, first clone the repo. Then, install the dependencies by running npm:

```sh
npm run setup
```

## Build and Serve

You can easily build and serve the app in production mode:

```sh
npm run static
```

This will run both `api` and `ui` build and hosting in parallel, there are no auto-reloads.

You can access the UI:

[http://localhost:4250](http://localhost:4250)

## Run and Reload

```sh
npm start
```

This will perform a static build of the API, serve that API and then host an dynamic instance of the UI with auto-reload.

Both API and UI is hosted on different ports:

UI: [http://localhost:4202](http://localhost:4202)   
API: [http://localhost:4250](http://localhost:4250)

## Build and Deploy

Building the production code and prepare it for deployment can be done using:

```sh
npm run build
```

This will build both the `api` (Node.js) and the `ui` (Angular) and copy the output from the `ui` into the API. This allows both the API and UI to be hosted on same web server.

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

You can also use an .env file during development to configure environment variables. See the `.env.sample` file.

## Docker

The Dockerfile will take pre-built output and copy that into the image. The `docker-compose.yml` will build the dev image and run local instance of both
the vault and the mongodb database.

`deploy/docker-compose.yml` is the file to use if you want to deploy to production of ready-built docker image that is public available on Docker Hub.

```sh
$ npm run build
$ docker-compose build
$ docker-compose up
```

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

When the client vault connects up to a server vault (which must be accessible through firewall if on public network, client vault can be behind NAT/firewall), it will initially publish all local events, if there are any.

Next step is to start download events from the server. If there is no previous state stored, sync will happen from zero.

The server does not keep track of sync status of the connected clients. When the client is finished with sync, it will register itself into the "new data room" on Web Socket to be signaled to query for new data.

All connections must be authenticated (to be implemented) to perform operations on the events API.

## Restrictions

When a Vault has registered an outbound (client/server) relationship, the target Vault cannot register a connection back to the same Vault. This is a limitation in the software and the software should avoid such circular connections.

To setup a resilient network of Blockcore Vault instances, you need at minimum 3 instances.

Vault #1 > Vault #2 > Vault #3 > Vault #1.

Whenever an event enters any of these vaults, it will be immediately delivered to both outgoing and incoming connections with a signal over Web Sockets. This ensures if there is some issues or drop between #3 and #1, then #1 will still receive the event from #2.

The next level of resilience, is having a total of #5 public vault instances. With 5 instances, each of them can have two outgoing and two incoming connections.

In both of these scenarios, there can be any number of non-public and incoming-only instances of Vault running and receiving data.

It is of course possible to run just a single vault instance, or a single public instance that only have clients connected.

Upon registration of a trusted vault, the user can decide if a full sync should be performed. By default a full sync is only done on the first connection, not on secondary. If there are two distinct network of vault that should be joint together, this option is useful to ensure all data exists in both networks (and the vaults that belongs to them). Essentially making the two networks into one.

If a client vault receives an event, it will forward that to all registered and connected server vaults.

# Key Management

The keys for identities is based upon standard HD-wallet practices with the specific purpose of 302.

Normal HD wallet pattern:

`m / purpose' / coin_type' / account' / change / address_index`

The purpose and coin_type used for Blockcore Vault is:

`m / purpose' / identity_type' / identity' / operation / key_index`

Example:

```
m/302'/616'/0'/0/0
```

# UI

Adding a new Vault can be done in two ways:

- Entering the URL to the Vault, which uses .well-known URL to discover DID. DID Resolve is then performed.

- Entering the DID to the Vault, which will perform DID Resolve and find the `VerifiableDataRegistry` (formally `EncryptedDataVault`) service registered in the DID Document. This should contain the endpoint for the Vault, which is then used to query the .well-known URL to grab additional metadata.

# Vocabulary

- `Vault` - An instance of the Blockcore Vault software.
- `VerifiableDataRegistry` - Verifiable Data Registry (VDR), the Blockcore Vault software is an implementation of an VDR.
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

Implement the .didState when requiring payments / attestation of submitted DID Documents: https://identity.foundation/did-registration/

DID Implementation Guide:
https://www.w3.org/TR/did-imp-guide/
