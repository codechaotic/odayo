import 'source-map-support/register'
// import * as pathToRegexp from 'path-to-regexp'
// import { Registry } from './src/Registry'

export { Bootstrap } from './src/Bootstrap'
export { Application } from './src/Application'
export { Route } from './src/Route'

// Registry.BootstrapOptions.addProperty('cwd', {
//   type: 'string',
//   default: process.cwd()
// })

// Registry.BootstrapOptions.addProperty('moduleGlob', {
//   type: 'string',
//   default: 'modules/**/*.js'
// })

// Registry.BootstrapOptions.addProperty('routeGlob', {
//   type: 'string',
//   default: 'routes/**/*.js'
// })

// Registry.ServerOptions.addProperty('port', {
//   type: 'integer',
//   default: 8080
// })

// Registry.ServerOptions.addProperty('host', {
//   type: 'string',
//   default: '0.0.0.0'
// })

// Registry.RouteOptions.addProperty('method', {
//   type: 'string'
// })

// Registry.RouteOptions.addProperty('path', {
//   type: 'string'
// })

// Registry.RouteParamOptions.addProperty('type', {
//   type: 'string'
// })

// Registry.RouteQueryOptions.addProperty('type', {
//   type: 'string'
// })

// Registry.Components.addComponent('router', route => {
//   const tokens = pathToRegexp.parse(route.options.path)
//   const regexp = pathToRegexp.tokensToRegExp(tokens)

//   return async (ctx, next) => {
//     const match = regexp.exec(ctx.path)
//     if (match) {
//       ctx.state.router = { tokens, keys: Array.from(match).slice(1) }
//       await next()
//     }
//   }
// })

// Registry.Components.addComponent('queryParser', options => {
//   return async (ctx, next) => {
//     await next()
//   }
// })

// Registry.Components.addComponent('paramParser', options => {
//   return async (ctx, next) => {
//     await next()
//   }
// })