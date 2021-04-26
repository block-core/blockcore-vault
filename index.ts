import express from "express";
import { routes } from "./routes";

const app = express();
const PORT = 3000;

app.use(express.json());
// app.use(express.urlencoded());
app.disable('x-powered-by');

// A way to show custom headers, we won't expose it for security reasons.
// function customHeaders(req: any, res: any, next: any) {
//   app.disable('x-powered-by');
//   res.setHeader('X-Powered-By', 'Blockcore Vault v0.0.1');
//   next();
// }

// app.use(customHeaders);

routes.forEach((route) => {
  const { method, path, middleware, handler } = route;
  app[method](path, ...middleware, handler);
});

app.listen(PORT, () => {
  console.log(`Blockcore Vault @ http://localhost:${PORT}`);
});



