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
