import http from 'node:http';

import { routes } from './routes.js';
import { json } from './middlewares/json.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const routeFind = routes.find(route => {
    return route.method === method && route.path.test(url)
  });

  if(routeFind) {
    const routeParams = req.url.match(routeFind.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return routeFind.handler(req, res);
  }

  return res.writeHead(404).end();
})

server.listen(3333);
