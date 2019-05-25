import { ApplicationContext } from './ApplicationContext'
import { RouteContext } from './RouteContext'
import { Types } from './Types'
import { Server } from './Server'

import * as path from 'path'

export namespace Loader {
  let loadPromise = null as Promise<void>
  let loadCallback = null as Types.ApplicationCallback

  let applicationPromise = null as Promise<void>
  let applicationContext = null as ApplicationContext<any>

  let routePromise = null as Promise<void>
  let routeContext = null as RouteContext<any>

  /**
   * Import a file watching and set a custom callback to be executed
   * when an application context is loaded
   */
  export function loadSource (source: string, callback: Types.ApplicationCallback) {
    loadPromise = Promise.resolve(loadPromise)
    .then(() => {
      const file = path.resolve(process.cwd(), source)
      delete require.cache[file]
      loadCallback = callback
      return import(file)
    })
    .then(() => Promise.resolve(applicationPromise))
    .then(() => loadPromise = loadPromise = null)
    .catch(error => {
      console.log(error)
    })
  }

  export function loadApplicationContext (context: ApplicationContext<any>, load: Function) {
    applicationPromise = Promise.resolve(applicationPromise)
    .then(() => applicationContext = context)
    .then(() => Promise.resolve(load()))
    .then(() => applicationContext.getResult())
    .then(result => {
      if (loadCallback === null) {
        new Server(result).start()
      } else {
        return Promise.resolve(loadCallback(result))
      }
    })
    .then(() => applicationPromise = applicationContext = null)
    .catch(error => {
      console.log(error)
    })
  }

  export function loadRouteContext (context: RouteContext<any>, load: Function) {
    routePromise = Promise.resolve(routePromise)
    .then(() => routeContext = context)
    .then(() => Promise.resolve(load()))
    .then(() => routeContext.getResult())
    .then(result => {
      applicationContext.addRoute(result)
    })
    .then(() => routePromise = routeContext = null)
    .catch(error => {
      console.log(error)
    })
  }

  export function getApplicationContext <Modules = any > () : ApplicationContext<Modules> {
    return applicationContext
  }

  export function getRouteContext <Modules = any > () : RouteContext<Modules> {
    return routeContext
  }
}
