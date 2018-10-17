import pipe from 'callbag-pipe'
import { listenable, pullable, willBe } from '@jeetiss/callbag-marble-tester'

import concatMap from '../src'

test('works with listenable sources', () =>
  pipe(
    listenable('--o----o-|'),
    concatMap(() => listenable('-i-i-|')),
    willBe('---i-i--i-i-|'),
  ))

test('works with pullable sources', () =>
  pipe(
    pullable('--a--b--c--|'),
    concatMap(() => pullable('-q-w-|')),
    willBe('-q-w--q-w--q-w-|'),
  ))
