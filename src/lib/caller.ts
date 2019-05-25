import * as path from 'path'
import * as stack from 'stack-trace'

export function caller () {
  const root = path.resolve(__dirname, '..')
  const caller = stack.get().find(frame => {
    const filename = frame.getFileName()
    if (filename !== null) {
      const prefix = filename.slice(0, root.length)
      return prefix !== root
    }
  })
  return path.dirname(caller.getFileName())
}
