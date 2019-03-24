import { Types } from './src/Types'

export interface Components {
  router: Types.RouteComponent
  queryParser: Types.RouteComponent
  paramParser: Types.RouteComponent
}

export interface RouteOptions {
  path: string
  method: Types.RouteMethod
}

export interface RouteParamOptions {
  type: 'string' | 'number'
}

export interface RouteQueryOptions {
  type: 'string' | 'number'
}

export interface RouteState {
  router: {
    tokens: any
    keys: string[]
  }
}

