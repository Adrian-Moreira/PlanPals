export interface ObjectMap {
  [name: string]: any
}

export function debug(logName: string, structuredLog: ObjectMap) {
  console.debug({
    ...structuredLog,
    logName,
  })
}
