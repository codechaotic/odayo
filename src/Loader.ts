import { BootstrapContext } from './Bootstrap'
import { ApplicationContext } from './Application'
import { Types } from './Types'

export namespace Loader {
  let applicationContext: ApplicationContext<any>
  let applicationPromise: Promise<void>

  let bootstrapContext: BootstrapContext
  let bootstrapPromise: Promise<void>

  export async function bindApplicationContext <Modules> (context: ApplicationContext<Modules>, callback: Function) {
    if (applicationPromise) await applicationPromise
    applicationContext = context
    applicationPromise = Promise.resolve(callback())
    return applicationPromise
  }

  export function loadRoute <Modules = any> (loader: Types.RouteLoader<Modules>) : void {
    if (applicationContext) {
      applicationContext.addRouteLoader(loader)
    } else throw new Error('Loader has no bound application context')
  }

  export async function bindBootstrapContext (context: BootstrapContext, callback: Function) {
    if (bootstrapPromise) await bootstrapPromise
    bootstrapContext = context
    bootstrapPromise = Promise.resolve(callback())
    return bootstrapPromise
  }

  export function loadApplication (loader: Types.ApplicationLoader) : void {
    if (bootstrapContext) {
      bootstrapContext.addApplicationLoader(loader)
    } else throw new Error('No execution context has been created')
  }
}
