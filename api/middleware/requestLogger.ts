import { RequestHandler as Middleware } from "express";
import { log } from '../services/logger';

export const requestLogger: Middleware = (req, res, next) => {
  log.info(req.path);
  next();
};
