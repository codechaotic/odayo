import * as path from 'path'
import * as glob from 'glob'
import * as stack from 'stack-trace'
import { Container } from 'diminish'

import { Types } from './Types'
import { Loader } from './Loader'
import { Route, RouteOptions, RouteResult } from './Route'

export interface ApplicationOptions<Modules> {
  cwd?: string
  modules?: string
  routes?: string
  load?: (this: ApplicationHelper<Modules>, modules: Modules) => void
}

export interface ApplicationResult {
  routes: RouteResult[]
}

export class ApplicationContext <Modules> {
  container = new Container()
  result = {
    routes: []
  } as ApplicationResult
  promises = [] as Promise<void>[]
  options: ApplicationOptions<Modules>

  constructor (options: ApplicationOptions<Modules>) {
    this.options = {} as ApplicationOptions<Modules>
    this.options.load = options.load

    const root = path.resolve(__dirname, '..')
    const caller = stack.get().find(frame => {
      const filename = frame.getFileName()
      if (filename !== null) {
        const prefix = filename.slice(0, root.length)
        return prefix !== root
      }
    })
    this.options.cwd = path.resolve(options.cwd || path.dirname(caller.getFileName()))
    this.options.modules = path.resolve(this.options.cwd, options.modules || 'modules/**/*.js')
    this.options.routes = path.resolve(this.options.cwd, options.routes || 'routes/**/*.js')
  }

  async getResult () {
    await Promise.all(this.promises)
    return this.result
  }

  async addRouteLoader (loader: (context: ApplicationContext<Modules>) => Promise<RouteResult> | RouteResult) {
    this.promises.push((async () => {
      const route = await Promise.resolve(loader(this))
      this.result.routes.push(route)
    })())
  }
}

export function Application <Modules = any> (options: ApplicationOptions<Modules>) {
  Loader.loadApplication(async () => {
    const application = new ApplicationContext<Modules>(options)
    const helper = new ApplicationHelper<Modules>(application)

    await application.container.import(application.options.modules)

    helper.loadRoutes(application.options.routes)

    if (application.options.load) {
      const returnValue = application.container.invoke(helper, application.options.load)
      await Promise.resolve(returnValue)
    }

    return application.getResult()
  })
}

export class ApplicationHelper <Modules> {
  constructor(private context: ApplicationContext<Modules>) {}

  param (name: string, options: any ) {

  }

  query (name: string, options: any ) {

  }

  use (middleware: Types.RouteMiddleware) {

  }

  route (options: RouteOptions<Modules>) {
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