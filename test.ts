/// <reference path="./typings/index.d.ts" />

import * as test from 'tape'
import { Maybe, Either } from './src/main'

test('Maybe', (t) => {
  const m = Maybe.fmap((v: number) => v + 5, new Maybe.Just(5))
  const n = Maybe.fmap((v: number) => v + 5, new Maybe.Nothing)
  const m2 = Maybe.flatMap((v: number) => new Maybe.Just(v + 5), new Maybe.Just(5))
  const n2 = Maybe.flatMap((v: number) => new Maybe.Just(v + 5), new Maybe.Nothing)
  const m3 = Maybe.unit(5)

  t.true(m instanceof Maybe.Just && m.val === 10)
  t.true(n instanceof Maybe.Nothing, 'n is Nothing'),
  t.true(m2 instanceof Maybe.Just, 'm is Just(5)'),
  t.true(n2 instanceof Maybe.Nothing, 'n is Nothing'),
  t.true(m3 instanceof Maybe.Just && m3.val === 5, 'm3 is Just(5)')
  t.end()
})
