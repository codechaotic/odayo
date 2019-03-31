import { BootstrapResult, BootstrapOptions } from './Bootstrap'
import { Types } from './Types'
import * as Koa from 'koa'
import * as compose from 'koa-compose'
import * as pathToRegexp from 'path-to-regexp'
import * as http from 'http'

export async function Build (result: BootstrapResult, build: BootstrapOptions['build']) {
  switch (build) {
    case 'run': {
      for (const application of result.applications) {
        const app = new Koa<Types.RouteState, {}>()
        for (const route of application.routes) {
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


      break
    }

    case 'docs': {

      break
    }

    default: throw new Error(`Unrecognized build argument "${build}"`)
  }
}