export default function concatMap(project) {
  return source => (start, sink) => {
    if (start !== 0) return

    const queue = []
    let innerTalkback = null
    let sourceTalkback

    const talkback = (type, data) => {
      if (type === 0) return

      sourceTalkback(type, data)

      if (type === 2 && innerTalkback !== null) {
        innerTalkback(type, data)
      }
    }

    const innerCallbag = (type, data) => {
      if (type === 0) {
        innerTalkback = data
        sink(0, talkback)
        return
      }

      if (type === 1) {
        sink(1, data)
        return
      }

      if (type === 2) {
        innerTalkback = null

        if (queue.length === 0) {
          return
        }

        project(queue.shift())(0, innerCallbag)
      }
    }

    source(0, (type, data) => {
      if (type === 0) {
        sourceTalkback = data
        return
      }

      if (type === 1) {
        if (innerTalkback !== null) {
          queue.push(data)
          return
        }

        project(data)(0, innerCallbag)
        return
      }

      if (type === 2) {
        sink(2, data)

        if (innerTalkback !== null) {
          innerTalkback(2, data)
        }
      }
    })
  }
}
