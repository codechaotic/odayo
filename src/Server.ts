import * as Koa from 'koa'
import * as compose from 'koa-compose'
import * as pathToRegexp from 'path-to-regexp'
import * as http from 'http'

import { Types } from './Types'

export class Server {
  constructor (private result: Types.ApplicationResult) {}

  start () {
    const app = new Koa<Types.RouteState, {}>()
    const routes = this.result.routes

    for (const route of routes) {
      const keys = []
      const regexp = pathToRegexp(route.path)
      const filter = async (ctx, next) => {
        if (ctx.method === route.method.toUpperCase()) {
          if (regexp.test(ctx.path)) await next()
        }
      }
      app.use(compose([filter].concat(route.middleware)))
    }

    const server = http.createServer(app.callback())
    server.listen(8080)
  }

  stop () {

  }
}
