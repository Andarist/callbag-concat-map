const subscribe = (source, sink) => {
  let talkback
  let ended = false

  source(0, (t, d) => {
    if (t === 0) talkback = d
    if (t === 1) sink(1, d)
    if (t === 0 || t === 1) talkback(1)
    if (t === 2) {
      ended = true
      sink(2, d)
    }
  })

  return {
    ended: () => ended,
    dispose: () => {
      ended = true
      talkback && talkback(2)
    },
  }
}

export default function concatMap(project) {
  return source => (start, sink) => {
    if (start !== 0) return

    let subscribtions = []
    let sinkTalkback
    let sourceTalkback

    source(0, (t, d) => {
      if (t === 0) {
        sourceTalkback = d
        sink(0, (t, d) => {
          if (t === 0) sinkTalkback = d
          if (t === 2) {
            // unsubscribe all
            subscribtions.forEach(sub => sub.dispose())
            subscribtions = []
            sourceTalkback && sourceTalkback(2, d)
          }
        })
      }

      if (t === 1) {
        subscribtions.push(
          subscribe(project(d), (T, D) => {
            if (T === 1) sink(1, D)
            if (
              T === 2 &&
              !sourceTalkback &&
              subscribtions.every(sub => sub.ended())
            ) {
              // unsubscribe if it last inner source
              sink(2, D)
            }
          }),
        )
      }

      if (t === 0 || t === 1) {
        sourceTalkback(1)
      }

      if (t === 2) {
        sourceTalkback = null

        // unsubscribe if every inner source ended
        subscribtions.every(sub => sub.ended()) && sink(2, d)
      }
    })
  }
}
