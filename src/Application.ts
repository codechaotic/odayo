import * as path from 'path'
import * as glob from 'glob'
import { Container } from 'diminish'

import { Types } from './Types'
import { Loader } from './Loader'
import { Route } from './Route'
import { caller } from './lib/caller'

export function Application <Modules = any> (options: Types.ApplicationOptions<Modules>) {
  Loader.loadApplication(async () => {
    const application = new ApplicationContext<Modules>(options)
    const helper = new ApplicationBuilder<Modules>(application)

    await application.container.import(application.options.modules)

    helper.loadRoutes(application.options.routes)

    if (application.options.load) {
      const returnValue = application.container.invoke(helper, application.options.load)
      await Promise.resolve(returnValue)
    }

    return application.getResult()
  })
}

export class ApplicationContext <Modules> {
  result = {} as Types.ApplicationResult
  options = {} as Types.ApplicationOptions<Modules>
  promises = [] as Promise<void>[]
  container = new Container()

  constructor (options: Types.ApplicationOptions<Modules>) {
    this.options.load = options.load
    this.options.cwd = path.resolve(options.cwd || caller())
    this.options.modules = path.resolve(this.options.cwd, options.modules || 'modules/**/*.js')
    this.options.routes = path.resolve(this.options.cwd, options.routes || 'routes/**/*.js')
    this.result.routes = []
    this.result.middleware = []
    this.result.query = []
    this.result.param = []
  }

  async getResult () {
    await Promise.all(this.promises)
    return this.result
  }

  async addRouteLoader (loader: Types.RouteLoader<Modules>) {
    this.promises.push((async () => {
      const route = await Promise.resolve(loader(this))
      this.result.routes.push(route)
    })())
  }

  async addMiddleware (middleware: Types.RouteMiddleware) {
    this.result.middleware.push(middleware)
  }

  async addQuery (query: Types.RouteQuery) {
    this.result.query.push(query)
  }

  async addParam (param: Types.RouteParam) {
    this.result.param.push(param)
  }
}

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
    Loader.bindApplicationContext(this.context, async () => {
      Route(options)
    })
  }

  loadRoutes (routeGlob) {
    Loader.bindApplicationContext(this.context, async () => {
      const src = path.resolve(this.context.options.cwd, routeGlob)
      const files = await new Promise<Array<string>>((resolve, reject) => {
        glob(src, (error, files) => {
          error ? reject(error) : resolve(files)
        })
      })

      for (const file of files) {
        delete require.cache[file]
        await import(file)
      }
    })
  }
}