# callbag-concat-map

Callbag operator that maps to inner source, subscribe and emit in order.

## Example

```js
import concatMap from 'callbag-concat-map'
import fromEvent from 'callbag-from-event'
import forEach from 'callbag-for-each'
import interval from 'callbag-interval'
import pipe from 'callbag-pipe'
import take from 'callbag-take'

pipe(
  fromEvent(document, 'click'),
  concatMap(() => pipe(interval(1000), take(4))),
  forEach(value => {
    // For every click on the "document" it will emit values 0 to 3 spaced
  }),
)
```
