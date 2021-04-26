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
