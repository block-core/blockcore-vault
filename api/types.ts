import { Request, RequestHandler as Middleware, Response } from "express";
import { IServer } from "./data/models";

export type Vault = {
  id: string, enabled: boolean, name: string,
  description: string, url: string, created: Date,
  modified: Date, lastSeen: Date, lastFullSync: Date,
  wellKnownConfiguration: string, state: string
};

type Method =
  | "get"
  | "head"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "options"
  | "trace"
  | "patch";

export type Handler = (req: Request, res: Response) => any;

export type Route = {
  method: Method;
  path: string;
  middleware: Middleware[];
  handler: Handler;
};

export type SyncState = {
  server?: IServer | null,
  syncStart?: Date,
  syncEnd?: Date,
  countReceived: number,
  countSent: number
};

export type Paged<T> =
  {
    data: T[],
    totalNumber: number,
    totalPages: number,
    currentPage: number
  }

export type EventResponse = {
  type: string,
  operation: "create" | "replace" | "delete", // TODO: Add them all, don't remember them right now.
  sequence: number,
  id: string,
  published: Date,
  received: Date,
  jwt: string
}