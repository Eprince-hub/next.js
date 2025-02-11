// Combined load times for loading client components
let clientComponentLoadStart = 0
let clientComponentLoadTimes = 0
let clientComponentLoadCount = 0

export function wrapClientComponentLoader(ComponentMod: any) {
  if (!('performance' in globalThis)) {
    return ComponentMod.__next_app__
  }

  return {
    require: (...args: any[]) => {
      if (clientComponentLoadStart === 0) {
        clientComponentLoadStart = performance.now()
      }

      const startTime = performance.now()
      try {
        clientComponentLoadCount += 1
        return ComponentMod.__next_app__.require(...args)
      } finally {
        clientComponentLoadTimes += performance.now() - startTime
      }
    },
    loadChunk: (...args: any[]) => {
      const startTime = performance.now()
      try {
        clientComponentLoadCount += 1
        return ComponentMod.__next_app__.loadChunk(...args)
      } finally {
        clientComponentLoadTimes += performance.now() - startTime
      }
    },
  }
}

export function getClientComponentLoaderMetrics(
  options: { reset?: boolean } = {}
) {
  const metrics = {
    clientComponentLoadStart,
    clientComponentLoadTimes,
    clientComponentLoadCount,
  }

  if (options.reset) {
    clientComponentLoadStart = 0
    clientComponentLoadTimes = 0
    clientComponentLoadCount = 0
  }

  return metrics
}
