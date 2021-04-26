import { login } from "./controllers/auth";
import { home } from "./controllers/home";
import { signup } from "./controllers/user";
import { deleteVault, getVault, getVaults, putVault } from "./controllers/vault";
import {  wellKnownDid, wellKnownDidConfiguration, wellKnownVaultConfiguration } from "./controllers/well-known";
import { requestLogger } from "./middleware/requestLogger";
import { Route } from "./types";

export const routes: Route[] = [
  {
    method: "get",
    path: "/",
    middleware: [],
    handler: home,
  },
  {
    method: "post",
    path: "/users",
    middleware: [],
    handler: signup,
  },
  {
    method: "post",
    path: "/login",
    middleware: [requestLogger],
    handler: login,
  },
  {
    method: "get",
    path: "/.well-known/vault-configuration.json",
    middleware: [requestLogger],
    handler: wellKnownVaultConfiguration,
  },
  {
    method: "get",
    path: "/.well-known/did.json",
    middleware: [requestLogger],
    handler: wellKnownDid,
  },
  {
    method: "get",
    path: "/.well-known/did-configuration.json",
    middleware: [requestLogger],
    handler: wellKnownDidConfiguration,
  },
  {
    method: "get",
    path: "/vault",
    middleware: [requestLogger],
    handler: getVaults,
  },
  {
    method: "get",
    path: "/vault/:id",
    middleware: [requestLogger],
    handler: getVault,
  },
  {
    method: "put",
    path: "/vault/:id",
    middleware: [requestLogger],
    handler: putVault,
  },
  {
    method: "delete",
    path: "/vault",
    middleware: [requestLogger],
    handler: deleteVault,
  },
];
