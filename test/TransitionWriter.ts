import * as test from 'tape'
import { ITransitionWriter, TransitionWriter } from '../src/TransitionWriter'
import { IFuture, Future, unit as futureUnit, fmap as futureFlatMap } from '../src/Future'

test('TransitionWriter', t => {
  type tple = [ string, number ]

  const snapshot = (t: number) => futureUnit(null)
  const record = (t: string) => futureUnit(null)
  const fork = (r: ((o: tple) => void)) => setTimeout(r, 200, [ 'cheese', 5 ])
  const tw: ITransitionWriter<string, number> = new TransitionWriter(record, snapshot, fork)

  t.end()
})
