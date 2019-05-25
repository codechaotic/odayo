import * as glob from 'glob'

export async function importGlob (sourceGlob: string) {
  const files = await new Promise<Array<string>>((resolve, reject) => {
    glob(sourceGlob, (error, files) => {
      error ? reject(error) : resolve(files)
    })
  })

  for (const file of files) {
    delete require.cache[file]
    await import(file)
  }
}
