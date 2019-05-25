import { Types } from './Types'
import { Loader } from './Loader'
import { RouteContext } from './RouteContext'
import { RouteBuilder } from './RouteBuilder'

export function Route<Modules = any> (options: Types.RouteOptions<Modules>) {
  const routeContext = new RouteContext<Modules>(options)
  const routeBuilder = new RouteBuilder<Modules>(routeContext)
  const applicationContext = Loader.getApplicationContext()

  Loader.loadRouteContext(routeContext, async () => {
    const loadResult = applicationContext.container.invoke(routeBuilder, routeContext.options.load)
    routeContext.addPromise(Promise.resolve(loadResult))
  })
}
