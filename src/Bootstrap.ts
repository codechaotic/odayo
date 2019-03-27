import * as path from 'path'
import * as glob from 'glob'

import { Loader } from './Loader'
import { ApplicationResult } from './Application'
import { Build } from './Build'

export interface BootstrapOptions {
  source: string
  build: 'run' | 'docs'
}

export interface BootstrapResult {
  applications: ApplicationResult[]
}

export class BootstrapContext {
  result = {} as BootstrapResult
  options = {} as BootstrapOptions
  promises = [] as Promise<void>[]

  constructor (options: BootstrapOptions) {
    this.options.source = path.resolve(process.cwd(), options.source)
    this.options.build = options.build
    this.result.applications = []
  }

  async getResult () {
    await Promise.all(this.promises)
    return this.result
  }

  async addApplicationLoader (loader: (context: BootstrapContext) => Promise<ApplicationResult> | ApplicationResult) {
    this.promises.push((async () => {
      const application = await Promise.resolve(loader(this))
      this.result.applications.push(application)
    })())
  }
}

export function Bootstrap (options: BootstrapOptions) {
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

    await Build(result, options.build)
  })
}