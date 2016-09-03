import { Maybe, Either } from './src/main'

var m = Maybe.fmap((v: number) => v + 5, new Maybe.Just(5))
var n = Maybe.fmap((v: number) => v + 5, new Maybe.Nothing)
var m2 = Maybe.flatMap((v: number) => new Maybe.Just(v + 5), new Maybe.Just(5))
var n2 = Maybe.flatMap((v: number) => new Maybe.Just(v + 5), new Maybe.Nothing)
var m3 = Maybe.unit(5)

function run (tests: Either.Either<string, boolean>[]) {
  tests.forEach((t, i) => { if ( !t.success ) console.log(i, t.message) })
} 

function test (a: any, err?: string): Either.Either<string, boolean> {
  if ( a ) return new Either.Success(true)
  else     return new Either.Failure(err || '')
}

run([
  test( m instanceof Maybe.Just && m.val === 10 , 'm is Just(5)'),
  test( n instanceof Maybe.Nothing, 'n is Nothing'),
  test( m2 instanceof Maybe.Just, 'm is Just(5)'),
  test( n2 instanceof Maybe.Nothing, 'n is Nothing'),
  test( m3 instanceof Maybe.Just && m3.val === 5, 'm3 is Just(5)')
])
