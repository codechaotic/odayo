import { Container } from 'diminish'

import { Types } from './Types'
import { Loader } from './Loader'

export interface RouteOptions<Modules> {
  path: string
  method: Types.RouteMethod
  load: (this: RouteHelper<Modules>, modules: Types.Inferred<Modules>) => void
}

export interface RouteResult {
  path: string
  method: Types.RouteMethod
  middleware: Types.RouteMiddleware[]
}

export class RouteContext <Modules> {
  result = {
    middleware: []
  } as RouteResult
  options: RouteOptions<Modules>
  promises = [] as Promise<void>[]

  constructor (options: RouteOptions<Modules>) {
    this.options = {} as RouteOptions<Modules>
    this.options.load = options.load
    this.options.path = options.path
    this.options.method = options.method
    this.result.path = options.path
    this.result.method = options.method
  }

  async getResult () {
    await Promise.all(this.promises)
    return this.result
  }

  // async addLoader (loader: (context: RouteContext<Modules>) => Promise<void> | void) {
  //   const promise = Promise.resolve(loader(this))
  //   this.promises.push(promise)
  // }
}

export function Route<Modules> (options: RouteOptions<Modules>) {
  const routeContext = new RouteContext<Modules>(options)

  Loader.loadRoute(async applicationContext => {
    const helper = new RouteHelper<Modules>(routeContext)

    const returnValue = applicationContext.container.invoke(helper, options.load)
    await Promise.resolve(returnValue)

    return routeContext.getResult()
  })
}

export class RouteHelper <Modules> {
  constructor(private context: RouteContext<Modules>) {}

  use (middleware: Types.RouteMiddleware) {
    if (this.context.result.middleware === undefined) {
      this.context.result.middleware = []
    }

    this.context.result.middleware.push(middleware)
  }
}
