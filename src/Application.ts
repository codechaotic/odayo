import { Types } from './Types'
import { Loader } from './Loader'
import { ApplicationContext } from './ApplicationContext'
import { ApplicationBuilder } from './ApplicationBuilder'

export function Application <Modules = any> (options: Types.ApplicationOptions<Modules>) {
  const applicationContext = new ApplicationContext<Modules>(options)
  const applicationBuilder = new ApplicationBuilder<Modules>(applicationContext)

  Loader.loadApplicationContext(applicationContext, async () => {
    await applicationContext.container.import(applicationContext.options.modules)

    applicationBuilder.loadRoutes(applicationContext.options.routes)

    if (applicationContext.options.load) {
      const loadResult = applicationContext.container.invoke(applicationBuilder, applicationContext.options.load)
      const promise = Promise.resolve(loadResult)
      applicationContext.addPromise(promise)
    }
  })
}
