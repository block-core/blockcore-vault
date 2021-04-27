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

### Identity ("DID") API

Allows operations for decentralized identity (DID), including registering new DIDs, updating DID Documents and resolving DID Documents.

Example public permalink for an `did:is` (DID Method) identity profile:

https://did.is/P41321351345asdjkldgdsfg

The ID of this identity: `did:is:P41321351345asdjkldgdsfg`

### Server ("Management") API

Allows a storage provider (administrator) to register and manage trusted Blockcore Vault instances to syncronize data with.

### .well-known API

Allows for public discovery using known URLs to find DID, DID Configuration and Vault Configuration.

### Statistics API

Used to retrieve various metrics recorded by the Blockcore Vault instance. This can be used to analyze the usage performed by various vault contributors.

Data from this API is used to enforce throtteling rules that an administrator applies to individual vaults.
