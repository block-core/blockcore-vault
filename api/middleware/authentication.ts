import { RequestHandler as Middleware } from "express";
import { state } from '../services/vault-state';

export const authentication: Middleware = (req, res, next) => {
  var apiKeyHeader = req.header('Vault-Api-Key');

  if (apiKeyHeader != state.apiKey) {
    res.status(401).send({ error: 'Invalid API Key' })
  }
  else {
    next();
  }
};
