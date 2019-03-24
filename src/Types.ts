import * as Core from '../core'
import * as Koa from 'koa'
import { Logger } from './Logger'

export namespace Types {
  export type Components = Core.Components
  export type RouteOptions = Core.RouteOptions
  export type RouteParamOptions = Core.RouteParamOptions
  export type RouteQueryOptions = Core.RouteQueryOptions
  export type RouteState = Core.RouteState
  
  export type Producer <Modules> = (modules: Modules) => Types.RouteMiddleware
  export interface RouteInfo <Modules> {
    options: Types.RouteOptions
    query: { [x: string]: Types.RouteQueryOptions }
    param: { [x: string]: Types.RouteParamOptions }
    producer: Producer<Modules>
  }

  export namespace RouteMethods {
    export const Get: Types.RouteMethod = 'get'
    export const Post: Types.RouteMethod = 'post'
    export const Patch: Types.RouteMethod = 'patch'
    export const Put: Types.RouteMethod = 'put'
    export const Delete: Types.RouteMethod = 'delete'
  }

  export interface BootstrapOptions {
    cwd: string
    moduleGlob: string
    routeGlob: string
  }
  
  export interface ServerOptions {
    port: number
    host: string
  }

  export type RouteContext = {
    [x in keyof Koa.ParameterizedContext<RouteState>]: Koa.ParameterizedContext<RouteState>[x]
  }

  export type RouteMiddleware = Koa.Middleware<RouteState>
  export type RouteComponent = (route: RouteInfo<any>) => RouteMiddleware
  export type RouteMethod = 'get' | 'patch' | 'post' | 'put' | 'delete'
  
  export interface RouteObject {
    options: RouteOptions
    main: (...args: any[]) => RouteMiddleware
  }
  
  export interface RouteConstructor {
    new (...args: any[]): RouteObject
    isRoute?: true
  }

  export type Inferred <Modules> = Modules extends { logger: any } ? Modules : Modules & { logger: Logger }
}
