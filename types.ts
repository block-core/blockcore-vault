import { Request, RequestHandler as Middleware, Response } from "express";

export type User = { username: string; password: string };

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
