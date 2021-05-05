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
