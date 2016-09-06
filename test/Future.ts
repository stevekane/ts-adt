import * as test from 'tape'
import { Future } from '../src/Future'

type User = { id: number }

const DELAY = 1 // ms

let id = 0

function fetchUser (): Future<User> {
  return new Future(r => setTimeout(r, DELAY, { id: id++ }))
}

test('Future', t => {
  const fu = Future.unit(5)
  const mapped = Future.unit(0)
                 .map(v => v + 5)
  const chained = Future.unit(5)
                  .chain(v => Future.unit(v + 5))
  const f = new Future(r => setTimeout(r, DELAY, 5))
  const doubleFetch = 
        fetchUser()
        .chain(u1 => fetchUser()
        .chain(u2 => Future.unit([ u1, u2 ])))

  fu.fork(a => t.same(a, 5, 'Future unit'))
  mapped.fork(a => t.same(a, 5, 'Future map'))
  chained.fork(a => t.same(a, 10, 'Future chain'))
  doubleFetch.fork(a => t.same(a, [ { id: 0 }, { id: 1 } ]))
  f.fork(a => t.same(a, 5, 'Future real resolve delay'))
  t.end()
})
