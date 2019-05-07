import { Types } from './Types'
import { Loader } from './Loader'

export class RouteContext <Modules> {
  result = {} as Types.RouteResult
  options = {} as Types.RouteOptions<Modules>
  promises = [] as Promise<void>[]

  constructor (options: Types.RouteOptions<Modules>) {
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

export function Route<Modules = any> (options: Types.RouteOptions<Modules>) {
  Loader.loadRoute(async application => {
    const route = new RouteContext<Modules>(options)
    const helper = new RouteBuilder<Modules>(route)

    await application.container.invoke(helper, options.load)

    return route.getResult()
  })
}

export class RouteBuilder <Modules> {
  constructor(private route: RouteContext<Modules>) {}

  use (middleware: Types.RouteMiddleware) {
    this.route.result.middleware.push(middleware)
  }
}
