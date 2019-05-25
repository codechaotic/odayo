import { ApplicationContext } from './ApplicationContext'
import { Route } from './Route'
import { Types } from './Types'
import { importGlob } from './lib/importGlob'

import * as path from 'path'

export class ApplicationBuilder <Modules> {
  constructor(private context: ApplicationContext<Modules>) {}

  param (param: Types.RouteParam) {
    this.context.addParam(param)
  }

  query (query: Types.RouteQuery) {
    this.context.addQuery(query)
  }

  use (middleware: Types.RouteMiddleware) {
    this.context.addMiddleware(middleware)
  }

  route (options: Types.RouteOptions<Modules>) {
    Route(options)
  }

  loadRoutes (routeGlob) {
    const sourceGlob = path.resolve(this.context.options.cwd, routeGlob)
    const promise = importGlob(sourceGlob)
    this.context.addPromise(promise)
  }
}