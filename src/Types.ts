import * as Koa from 'koa'
// import { BootstrapContext } from './Bootstrap'
import { ApplicationBuilder } from './ApplicationBuilder'
import { ApplicationContext } from './ApplicationContext'
import { RouteBuilder } from './RouteBuilder'

export namespace Types {
  export interface RouteState {}
  export type RouteContext = Koa.ParameterizedContext<RouteState>
  export type RouteMiddleware = Koa.Middleware<RouteState>
  export type RouteMethod = 'get' | 'patch' | 'post' | 'put' | 'delete'
  export type RouteLoader<Modules>
    = (context: ApplicationContext<Modules>) => Promise<RouteResult> | RouteResult

  export type ApplicationCallback = (application: ApplicationResult) => void

  export type ApplicationLoader = () => Promise<ApplicationResult> | ApplicationResult

  export interface ApplicationOptions<Modules> {
    cwd?: string
    modules?: string
    routes?: string
    load?: (this: ApplicationBuilder<Modules>, modules: Modules) => void
  }

  export interface ApplicationResult {
    routes: RouteResult[]
    middleware: RouteMiddleware[]
    query: RouteQuery[]
    param: RouteParam[]
  }

  export interface RouteOptions<Modules> {
    path: string
    method: RouteMethod
    load: (this: RouteBuilder<Modules>, modules: Modules) => void
  }

  export interface RouteResult {
    path: string
    method: RouteMethod
    middleware: RouteMiddleware[]
  }

  export type RouteQuery = RouteQuery.Number
                    | RouteQuery.Integer
                    | RouteQuery.String
                    | RouteQuery.Boolean
                    | RouteQuery.Date

  export namespace RouteQuery {
    export type Type = 'string'
                     | 'integer'
                     | 'number'
                     | 'boolean'
                     | 'date'

    export interface RouteQuery {
      type: Type
      key: string
      description?: string
      default?: any
      required?: boolean
    }

    export interface Number extends RouteQuery {
      type: 'number'
      default?: number
      minimum?: number
      exclusiveMinimum?: number
      maximum?: number
      exclusiveMaximum?: number
    }

    export interface Integer extends RouteQuery {
      type: 'integer'
      default?: number
      minimum?: number
      maximum?: number
    }

    export interface String extends RouteQuery {
      type: 'string'
      default?: string
      minLength?: number
      maxLength?: number
      pattern?: RegExp
    }

    export interface Boolean extends RouteQuery {
      type: 'boolean'
      default?: boolean
    }

    export interface Date extends RouteQuery {
      type: 'date'
      default?: Date
      minimum?: Date
      maximum?: Date
    }
  }

  export type RouteParam = RouteParam.IntegerParam
                    | RouteParam.StringParam

  export namespace RouteParam {
    export type Type = 'string'
                     | 'integer'

    export interface RouteParam {
      type: Type
      key: string
      description?: string
      default?: any
      required?: boolean
    }

    export interface IntegerParam extends RouteParam {
      type: 'integer'
      default?: number
      minimum?: number
      maximum?: number
    }

    export interface StringParam extends RouteParam {
      type: 'string'
      default?: string
      minLength?: number
      maxLength?: number
      pattern?: string
    }
  }
}

