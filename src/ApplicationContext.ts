import { Types } from './Types'
import { caller } from './lib/caller'

import * as path from 'path'
import { Container } from 'diminish'

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

  async addPromise (promise: Promise<any>) {
    this.promises.push(promise)
  }

  async getResult () {
    await Promise.all(this.promises)
    return this.result
  }

  async addRoute (route: Types.RouteResult) {
    this.result.routes.push(route)
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