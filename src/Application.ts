import * as path from 'path'
import * as glob from 'glob'
import * as stack from 'stack-trace'
import { Container } from 'diminish'

import { Types } from './Types'
import { Loader } from './Loader'
import { isLogger, Logger } from './Logger'
import { Route, RouteOptions, RouteHelper, RouteResult } from './Route'

export interface ApplicationOptions<Modules> {
  cwd?: string
  modules?: string
  routes?: string
  load?: (this: ApplicationHelper<Modules>, modules: Types.Inferred<Modules>) => void
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
    const odayoRoot = path.resolve(__dirname, '')
    const caller = stack.get().find(frame => {
      const prefix = frame.getFileName().slice(0, odayoRoot.length)
      return prefix !== odayoRoot
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
      const application = await Promise.resolve(loader(this))
      this.result.routes.push(application)
    })())
  }
}

export function Application <Modules = any> (options: ApplicationOptions<Modules>) {
  const applicationContext = new ApplicationContext<Modules>(options)

  Loader.loadApplication(async () => {
    await applicationContext.container.import(applicationContext.options.modules)

    if (!applicationContext.container.isRegistered('logger')) {
      await applicationContext.container.literal('logger', new Logger())
    }

    const logger = await applicationContext.container.resolve('logger')

    if (!isLogger(logger)) {
      throw new Error(`custom logger does not implement expected methods (debug, info, warn, error)`)
    }
    
    const helper = new ApplicationHelper<Modules>(applicationContext)

    helper.loadRoutes(applicationContext.options.routes)

    if (applicationContext.options.load) {
      const returnValue = applicationContext.container.invoke(helper, applicationContext.options.load)
      await Promise.resolve(returnValue)
    }

    return applicationContext.getResult()
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