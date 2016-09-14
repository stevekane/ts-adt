import * as test from 'tape'
import { IMealy, unit, flatMap, fmap } from '../src/Mealy'

test('Mealy', t => {
  enum Animal {
    Cow,
    Horse,
    Dog
  }
  const u: IMealy<number, number> = unit(5)
  const mb: IMealy<number, string> = flatMap(u, n => unit(n.toString()))
  const fb: IMealy<number, Animal> = fmap(n => n > 5 ? Animal.Cow : Animal.Dog, u)
  
  t.same(u.run(2)[0], 5)
  t.same(mb.run(2)[0], '5')
  t.same(fb.run(2)[0], Animal.Dog)
  t.end() 
})
