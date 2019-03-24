import * as path from 'path'
import * as glob from 'glob'

import { Loader } from './Loader'
import { ApplicationResult } from './Application'

export interface BootstrapResult {
  applications: ApplicationResult[]
}

export class BootstrapContext {
  promises = [] as Promise<void>[]
  result = {
    applications: []
  } as BootstrapResult

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

export function Bootstrap (appGlob) {
  const bootstrapContext = new BootstrapContext()

  Loader.bindBootstrapContext(bootstrapContext, async () => {
    const src = path.resolve(process.cwd(), appGlob)
    const files = await new Promise<Array<string>>((resolve, reject) => {
      glob(src, (error, files) => {
        error ? reject(error) : resolve(files)
      })
    })

    for (const file of files) {
      delete require.cache[file]
      await import(file)
    }

    const result = await bootstrapContext.getResult()

    console.log(JSON.stringify(result, null, 2))
  })
}