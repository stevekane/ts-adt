/// <reference path="./typings/index.d.ts" />

import * as test from 'tape'
import { Maybe, Either, Future /*, Continuation, IO */ } from './src/main'

test('Maybe', (t) => {
  const m = Maybe.fmap((v: number) => v + 5, new Maybe.Just(5))
  const n = Maybe.fmap((v: number) => v + 5, new Maybe.Nothing)
  const m2 = Maybe.flatMap((v: number) => new Maybe.Just(v + 5), new Maybe.Just(5))
  const n2 = Maybe.flatMap((v: number) => new Maybe.Just(v + 5), new Maybe.Nothing)
  const m3 = Maybe.unit(5)

  t.true(m instanceof Maybe.Just && m.val === 10)
  t.true(n instanceof Maybe.Nothing)
  t.true(m2 instanceof Maybe.Just)
  t.true(n2 instanceof Maybe.Nothing)
  t.true(m3 instanceof Maybe.Just && m3.val === 5)
  t.end()
})

test('Either', (t) => {
  const m = Either.fmap((v: number) => v + 5, new Either.Success(5))
  const n = Either.fmap((v: number) => v + 5, new Either.Failure('Error'))
  const m2 = Either.flatMap((v: number) => new Either.Success(v + 5), new Either.Success(5))
  const n2 = Either.flatMap((v: number) => new Either.Success(v + 5), new Either.Failure('Err'))
  const m3 = Either.unit(5)

  t.true(m instanceof Either.Success && m.val === 10)
  t.true(n instanceof Either.Failure && n.message === 'Error')
  t.true(m2 instanceof Either.Success)
  t.true(n2 instanceof Either.Failure && n2.message === 'Err')
  t.true(m3 instanceof Either.Success && m3.val === 5)
  t.end()
})

test('Future', (t) => {
  Future.unit(5).fork(a => t.same(a, 5))
  Future.fmap((v: number) => v + 5, Future.unit(0)).fork(a => t.same(a, 5))
  Future.flatMap((v: number) => Future.unit(v + 5), Future.unit(5)).fork(a => t.same(a, 10))
  t.end()
})
