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
  result = {} as RouteResult
  options = {} as RouteOptions<Modules>
  promises = [] as Promise<void>[]

  constructor (options: RouteOptions<Modules>) {
    this.options.load = options.load
    this.options.path = options.path
    this.options.method = options.method
    this.result.path = options.path
    this.result.method = options.method
    this.result.middleware = []
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

    await application.container.invoke(helper, options.load)

    return route.getResult()
  })
}

export class RouteHelper <Modules> {
  constructor(private route: RouteContext<Modules>) {}

  use (middleware: Types.RouteMiddleware) {
    this.route.result.middleware.push(middleware)
  }
}
