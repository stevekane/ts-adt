import * as test from 'tape'
import { unit, Just, Nothing } from '../src/Maybe'

test('Maybe', t => {
  const j = unit(5)
  const m = unit(5).map(v => v + 5)
  const n = (new Nothing as Nothing<number>).chain(v => unit(v + 5))
  const m2 = new Just(5).chain(v => new Just(v + 5))

  t.true(j.kind === 'Just' && j.val === 5)
  t.true(m.kind === 'Just' && m.val === 10)
  t.true(n.kind === 'Nothing')
  t.true(m2 instanceof Just && m2.val === 10)
  t.end()
})
