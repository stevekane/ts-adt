/// <reference path="./typings/index.d.ts" />

import * as test from 'tape'
import { Maybe, Either, Future , IO, Continuation } from './src/main'

test('Maybe', t => {
  const m = Maybe.fmap((v: number) => v + 5, new Maybe.Just(5))
  const n = Maybe.fmap((v: number) => v + 5, new Maybe.Nothing)
  const m2 = Maybe.flatMap(new Maybe.Just(5), (v: number) => new Maybe.Just(v + 5))
  const n2 = Maybe.flatMap(new Maybe.Nothing, (v: number) => new Maybe.Just(v + 5))
  const m3 = Maybe.unit(5)

  t.true(m instanceof Maybe.Just && m.val === 10)
  t.true(n instanceof Maybe.Nothing)
  t.true(m2 instanceof Maybe.Just)
  t.true(n2 instanceof Maybe.Nothing)
  t.true(m3 instanceof Maybe.Just && m3.val === 5)
  t.end()
})

test('Either', t => {
  const m = Either.fmap((v: number) => v + 5, new Either.Success(5))
  const n = Either.fmap((v: number) => v + 5, new Either.Failure('Error'))
  const m2 = Either.flatMap(new Either.Success(5), (v: number) => new Either.Success(v + 5))
  const n2 = Either.flatMap(new Either.Failure('Err'), (v: number) => new Either.Success(v + 5))
  const m3 = Either.unit(5)

  t.true(m instanceof Either.Success && m.val === 10)
  t.true(n instanceof Either.Failure && n.message === 'Error')
  t.true(m2 instanceof Either.Success)
  t.true(n2 instanceof Either.Failure && n2.message === 'Err')
  t.true(m3 instanceof Either.Success && m3.val === 5)
  t.end()
})

test('Future', t => {
  Future.unit(5).fork(a => t.same(a, 5))
  Future.fmap(v => v + 5, Future.unit(0)).fork(a => t.same(a, 5))
  Future.flatMap(Future.unit(5), v => Future.unit(v + 5)).fork(a => t.same(a, 10))
  t.end()
})

test('IO', t => {
  const processInfo = (): IO.IIO<NodeJS.Process> => new IO.IO(() => process)

  t.same(IO.unit(5).run(), 5)
  t.same(IO.fmap(v => v + 5, IO.unit(5)).run(), 10)
  t.same(IO.flatMap(IO.unit(5), v => IO.unit(v + 5)).run(), 10)
  t.same(processInfo().run().env.PWD, process.env.PWD)
  t.end() 
})

test('Continuation', t => {
  const { unit, flatMap, fmap } = Continuation
  const u5 = unit(5)
  const fMapped = fmap(v => v + 5, unit(5))
  const flatMapped = flatMap(unit(5), v => unit(v + 5))

  u5.run(v => t.same(v, 5))
  fMapped.run(v => t.same(v, 10))
  flatMapped.run(v => t.same(v, 10))
  t.end()
})
