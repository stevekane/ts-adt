import * as test from 'tape'
import { satisfy, unit, flatMap } from '../src/Parser'

function isAlpha (s: string): boolean {
  const cc = s.charCodeAt(0)

  return !isNaN(cc) && (( cc >= 65 && cc <= 90 ) || ( cc >= 97 && cc <= 122 ))
}

test('Parser', t => {
  const unitParser = unit(5)
  const unitResult = unitParser('string that does not matter')
  const num = '1'
  const alpha = 'a'
  const doubleChar = flatMap(
    satisfy(isAlpha), 
    c1 => flatMap(
      satisfy(isAlpha),
      c2 => unit([ c1, c2 ])))
  const dblRes = doubleChar('abc')
  const badDblRes = doubleChar('a1')

  unitResult.success && t.same(unitResult.val, 5)
  dblRes.success && t.same(dblRes.val, [ 'a', 'b' ])
  !badDblRes.success && t.same(badDblRes.message, 'isAlpha did not pass at 1')
  t.end()
})
