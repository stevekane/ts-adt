import * as test from 'tape'
import { fmap, flatMap, unit, Success, Failure } from '../src/Either'

test('Either', t => {
  const m = fmap((v: number) => v + 5, new Success(5))
  const n = fmap((v: number) => v + 5, new Failure('Error'))
  const m2 = flatMap(new Success(5), (v: number) => new Success(v + 5))
  const n2 = flatMap(new Failure('Err'), (v: number) => new Success(v + 5))
  const m3 = unit(5)

  t.true(m instanceof Success && m.val === 10)
  t.true(n instanceof Failure && n.message === 'Error')
  t.true(m2 instanceof Success)
  t.true(n2 instanceof Failure && n2.message === 'Err')
  t.true(m3 instanceof Success && m3.val === 5)
  t.end()
})
