import { getEvents, latestEvent, totalEvents } from "./controllers/event";
// import { home } from "./controllers/home";
import { createDIDDocument, deleteDIDDocument, getDIDDocument, handleOperation, updateDIDDocument } from "./controllers/identity";
import { createServer, deleteServer, getLocalServer, getServer, getServers, updateLocalServer, updateServer } from "./controllers/server";
import { getStatistics } from "./controllers/stats";
import { deleteVault, getVault, getVaults, putVault } from "./controllers/vault";
import { wellKnownDid, wellKnownDidConfiguration, wellKnownVaultConfiguration } from "./controllers/well-known";
import { authentication } from "./middleware/authentication";
import { requestLogger } from "./middleware/requestLogger";
import { Route } from "./types";

export const routes: Route[] = [
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

  {
    method: "get",
    path: "/event",
    middleware: [requestLogger],
    handler: getEvents,
  },
  {
    method: "get",
    path: "/event/count",
    middleware: [requestLogger],
    handler: totalEvents,
  },
  {
    method: "get",
    path: "/event/latest",
    middleware: [requestLogger],
    handler: latestEvent,
  },
  // {
  //   method: "get",
  //   path: "/event/:id",
  //   middleware: [requestLogger],
  //   handler: getEvent,
  // },


  {
    method: "get",
    path: "/management/server",
    middleware: [requestLogger, authentication],
    handler: getServers,
  },
  {
    method: "get",
    path: "/management/server/:id",
    middleware: [requestLogger, authentication],
    handler: getServer,
  },
  {
    method: "post",
    path: "/management/server",
    middleware: [requestLogger, authentication],
    handler: createServer,
  },
  {
    method: "put",
    path: "/management/server/:id",
    middleware: [requestLogger, authentication],
    handler: updateServer,
  },
  {
    method: "delete",
    path: "/management/server/:id",
    middleware: [requestLogger, authentication],
    handler: deleteServer,
  },

  {
    method: "get",
    path: "/management/setup",
    middleware: [requestLogger, authentication],
    handler: getLocalServer,
  },
  {
    method: "put",
    path: "/management/setup",
    middleware: [requestLogger, authentication],
    handler: updateLocalServer,
  },

  {
    method: "post",
    path: "/operation",
    middleware: [requestLogger],
    handler: handleOperation,
  },
  {
    method: "get",
    path: "/management/statistics",
    middleware: [requestLogger, authentication],
    handler: getStatistics,
  },

  // {
  //   method: "get",
  //   path: "/identity",
  //   middleware: [requestLogger],
  //   handler: getDIDDocuments,
  // },
  {
    method: "get",
    path: "/identity/:id",
    middleware: [requestLogger],
    handler: getDIDDocument,
  },
  {
    method: "post",
    path: "/identity",
    middleware: [requestLogger],
    handler: createDIDDocument,
  },
  {
    method: "put",
    path: "/identity/:id",
    middleware: [requestLogger],
    handler: updateDIDDocument,
  },
  {
    method: "delete",
    path: "/identity/:id",
    middleware: [requestLogger],
    handler: deleteDIDDocument,
  },
];