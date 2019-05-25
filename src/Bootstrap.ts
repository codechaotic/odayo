import { Loader } from './Loader'
import { Types } from './Types'

export function Bootstrap (source: string, callback: Types.ApplicationCallback) {
  Loader.loadSource(source, callback)
}
