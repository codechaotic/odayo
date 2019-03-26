import { Types } from './Types'
import { Loader } from './Loader'

export interface RouteOptions<Modules> {
  path: string
  method: Types.RouteMethod
  load: (this: RouteHelper<Modules>, modules: Modules) => void
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
}

export function Route<Modules = any> (options: RouteOptions<Modules>) {
  Loader.loadRoute(async application => {
    const route = new RouteContext<Modules>(options)
    const helper = new RouteHelper<Modules>(route)

    const returnValue = application.container.invoke(helper, options.load)
    await Promise.resolve(returnValue)

    return route.getResult()
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
