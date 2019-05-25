import { Types } from './Types'

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

  async addPromise (promise: Promise<any>) {
    this.promises.push(promise)
  }

  async getResult () {
    await Promise.all(this.promises)
    return this.result
  }
}