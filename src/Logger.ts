export interface Logger {
  debug (...args: any[]) : any
  info (...args: any[]) : any
  warn (...args: any[]) : any
  error (...args: any[]) : any
}

export function isLogger (x: any) : x is Logger {
  if (!x) return false
  if (!(x instanceof Object)) return false
  if (!(x.debug instanceof Function)) return false
  if (!(x.info instanceof Function)) return false
  if (!(x.warn instanceof Function)) return false
  if (!(x.error instanceof Function)) return false
  return true
}

export class Logger {
  debug (message: string) {
    console.log(`debug: ${message}`)
  }

  info (message: string) {
    console.log(` info: ${message}`)
  }

  warn (message: string) {
    console.log(` warn: ${message}`)
  }

  error (message: string) {
    console.log(`error: ${message}`)
  }
}
