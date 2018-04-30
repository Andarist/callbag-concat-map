import forEach from 'callbag-for-each'
import map from 'callbag-map'
import pipe from 'callbag-pipe'
import subject from 'callbag-subject'
import take from 'callbag-take'

import concatMap from '../src'

test('works', () => {
  const actual = []

  let source = subject()
  let inner

  pipe(
    source,
    concatMap(value => {
      inner = subject()
      return pipe(
        inner,
        map(innerValue => `${value}: ${innerValue}`),
        take(value + 2),
      )
    }),
    forEach(data => {
      actual.push(data)
    }),
  )

  return Promise.resolve()
    .then(() => {
      expect(actual).toEqual([])
      source(1, 1)
      source(1, 2)
    })
    .then(() => {
      expect(actual).toEqual([])
    })
    .then(() => {
      inner(1, 0)
      inner(1, 2)
      inner(1, 4)
      inner(1, 6)
      inner(1, 8)
      inner(1, 10)
      expect(actual).toEqual(['1: 0', '1: 2', '1: 4', '2: 6', '2: 8', '2: 10'])
      source(1, 3)
    })
    .then(() => {
      inner(1, 12)
      inner(1, 14)
      inner(1, 16)
      inner(1, 18)
      inner(1, 20)
      inner(1, 22)
      expect(actual).toEqual([
        '1: 0',
        '1: 2',
        '1: 4',
        '2: 6',
        '2: 8',
        '2: 10',
        '2: 12',
        '3: 14',
        '3: 16',
        '3: 18',
        '3: 20',
        '3: 22',
      ])
    })
})
