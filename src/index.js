export default function concatMap(project) {
  return source => (start, sink) => {
    if (start !== 0) return

    const queue = []
    let innerTalkback = null
    let sourceTalkback
    let outerSrcFinished = false

    const innerSink = (type, data) => {
      if (type === 0) {
        innerTalkback = data
        innerTalkback(1)
        return
      }

      if (type === 1) {
        sink(1, data)
        innerTalkback(1)
        return
      }

      if (type === 2 && data) {
        sink(2, data)
        return
      }

      if (type === 2) {
        innerTalkback = null

        if (queue.length === 0 && outerSrcFinished) {
          sink(2)
          return
        }

        project(queue.shift())(0, innerSink)
      }
    }

    const wrappedSink = (type, data) => {
      if (type === 2 && innerTalkback !== null) {
        innerTalkback(2, data)
      }
      sourceTalkback(type, data)
    }

    source(0, (type, data) => {
      if (type === 0) {
        sourceTalkback = data
        sink(0, wrappedSink)
        return
      }

      if (type === 1) {
        if (innerTalkback !== null) {
          queue.push(data)
          return
        }

        project(data)(0, innerSink)
        return
      }

      if (type === 2) {
        outerSrcFinished = true
      }
    })
  }
}
