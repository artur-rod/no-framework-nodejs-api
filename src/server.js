import http from "node:http"
import { batchCreate } from "./batch-creation.js"
import { json } from "./middlewares/json.js"
import { routes } from "./routes.js"
import { extractQueryParams } from "./utils/extract-query-params.js"

const server = http.createServer(async (req, res) => {
  if (req.headers["content-type"] && req.headers["content-type"].includes("multipart/form-data")) {
    return batchCreate(req, res)
  }

  await json(req, res)

  const { method, url } = req
  const route = routes.find(route => route.method === method && route.path.test(url))

  if (route) {
    const { query, ...params } = url.match(route.path).groups
    const queryParams = extractQueryParams(query)

    req.params = params
    req.query = queryParams

    return route.handler(req, res)
  }

  res.writeHead(404).end()
})

server.listen(3333)