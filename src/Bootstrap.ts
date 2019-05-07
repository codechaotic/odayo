import * as path from 'path'
import * as glob from 'glob'

import { Loader } from './Loader'
import { Types } from './Types'
import { Build } from './Build'

export class BootstrapContext {
  result = {} as Types.BootstrapResult
  options = {} as Types.BootstrapOptions
  promises = [] as Promise<void>[]

  constructor (options: Types.BootstrapOptions) {
    this.options.source = path.resolve(process.cwd(), options.source)
    this.options.build = options.build
    this.result.applications = []
  }

  async getResult () {
    await Promise.all(this.promises)
    return this.result
  }

  async addApplicationLoader (loader: Types.ApplicationLoader) {
    this.promises.push((async () => {
      const application = await Promise.resolve(loader(this))
      this.result.applications.push(application)
    })())
  }
}

export function Bootstrap (options: Types.BootstrapOptions) {
  const context = new BootstrapContext(options)

  Loader.bindBootstrapContext(context, async () => {
    const files = await new Promise<Array<string>>((resolve, reject) => {
      glob(context.options.source, (error, files) => {
        error ? reject(error) : resolve(files)
      })
    })

    for (const file of files) {
      delete require.cache[file]
      await import(file)
    }

    const result = await context.getResult()

    console.log(JSON.stringify(result, null, 2))
    // await Build(result, options.build)
  })
}