export const abortMap = new Map<string, (() => void)[]>()

export const addAbortController = (id: string, abortFn: () => void) => {
  abortMap.set(id, [...(abortMap.get(id) || []), abortFn])
}

export const removeAbortController = (id: string, abortFn: () => void) => {
  const callbackArr = abortMap.get(id)
  if (abortFn) {
    console.log('callbackArr.indexOf(abortFn)', callbackArr)
    callbackArr?.splice(callbackArr?.indexOf(abortFn), 1)
  } else abortMap.delete(id)
}

export const abortCompletion = (id: string) => {
  const abortFn = abortMap.get(id)
  if (abortFn) {
    for (const fn of abortFn) {
      fn()
      removeAbortController(id, fn)
    }
  }
}
