import * as Koa from 'koa'

export namespace Types {
  export interface RouteState {}
  export type RouteContext = Koa.ParameterizedContext<RouteState>
  export type RouteMiddleware = Koa.Middleware<RouteState>
  export type RouteMethod = 'get' | 'patch' | 'post' | 'put' | 'delete'
}
