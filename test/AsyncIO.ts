import * as test from 'tape'
import { AsyncIO, IAsyncIO, unit, flatMap, fmap } from '../src/AsyncIO'

test('AsyncIO', t => {
  const u = unit(5)

  u.run(v => t.same(v, 5))
  t.end()
})

test('Impls', t => {
  const wait = (t: number): AsyncIO<number> => new AsyncIO(r => {
    const begin = Date.now()

    setTimeout((_: void) => r(Date.now() - begin), t)
  })

  const log = (a: any) => {
    return new AsyncIO(function (r) {
      console.log(a) 
      r(a) 
    })
  }

  /*
    wait duration >> log text >> unit(out)

      or 

    do
      wait duration
      log text
      return out
  */
  const seq = <T>(duration: number, text: string, out: T): AsyncIO<T> => {
    return flatMap(
      wait(duration),    d => 
      flatMap(log(text), _ => 
      unit(out)))
  }

  // Wait returns the ACTUAL time in MS that waited so test reflects a reasonable range
  wait(5).run(v => t.true(v < 10 && v > 0, 'wait time between 0 and 10ms'))
  log('hello world').run(_ => t.true(true))

  const program = 
    flatMap(
      seq(1000, 'You watched the intro', null),
      _ => seq(1000, 'Updated your age', Math.floor(Math.random() * 25)))

  program.run(age => console.log(`You are ${ age } years old`))
  t.end()
})
