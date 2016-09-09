import * as test from 'tape'
import { IO } from '../src/IO'

test('IO', t => {
  const processInfo = (): IO<NodeJS.Process> => IO.unit(process)

  t.same(IO.unit(5).run(), 5)
  t.same(IO.unit(5).map(v => v + 5).run(), 10)
  t.same(IO.unit(5).chain(v => IO.unit(v + 5)).run(), 10)
  t.same(processInfo().run().env.PWD, process.env.PWD)
  t.end() 
})
