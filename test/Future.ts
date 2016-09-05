import * as test from 'tape'
import { unit, fmap, flatMap } from '../src/Future'

test('Future', t => {
  unit(5).fork(a => t.same(a, 5))
  fmap(v => v + 5, unit(0)).fork(a => t.same(a, 5))
  flatMap(unit(5), v => unit(v + 5)).fork(a => t.same(a, 10))
  t.end()
})
