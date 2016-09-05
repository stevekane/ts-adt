import * as test from 'tape'
import { IIO, IO, unit, fmap, flatMap } from '../src/IO'

test('IO', t => {
  const processInfo = (): IIO<NodeJS.Process> => new IO(() => process)

  t.same(unit(5).run(), 5)
  t.same(fmap(v => v + 5, unit(5)).run(), 10)
  t.same(flatMap(unit(5), v => unit(v + 5)).run(), 10)
  t.same(processInfo().run().env.PWD, process.env.PWD)
  t.end() 
})
