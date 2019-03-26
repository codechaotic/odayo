import 'source-map-support/register'

export { Bootstrap } from './src/Bootstrap'
export { Application } from './src/Application'
export { Route } from './src/Route'
export { Logger } from './src/Logger'
export { Env, loadEnv } from 'eznv'

export type AsyncReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => Promise<infer R> ? R : ReturnType<T>
