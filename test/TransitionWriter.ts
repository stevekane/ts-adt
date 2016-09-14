import * as test from 'tape'
// import { ITransitionWriter, TransitionWriter } from '../src/TransitionWriter'
import { IFuture, Future, unit as futureUnit, flatMap as futureFlatMap } from '../src/Future'

test('TransitionWriter', t => {
  // type tple = [ string, number ]

  // const snapshot = (t: number) => futureUnit(null)
  // const record = (t: string) => futureUnit(null)
  // const fork = (r: ((o: tple) => void)) => setTimeout(r, 200, [ 'cheese', 5 ])
  // const tw: ITransitionWriter<string, number> = new TransitionWriter(record, snapshot, fork)

  function snapshot<A> (a: A): IFuture<null> {
    console.log('snapshotted', a) 
    return futureUnit(null)
  }

  function record<B> (b: B): IFuture<null> {
    console.log('recorded', b) 
    return futureUnit(null)
  }

  function Intro (): IFuture<[ string, number ]> {
    return futureFlatMap(futureUnit([ 'cheese', 5 ]),
      (out: [ string, number ]) => 
        futureFlatMap(
          snapshot(out[0]), (n: null) => 
            futureFlatMap(
              record(out[1]),
                (m: null) => futureUnit(out)))) as IFuture<[ string, number ]>
  }

  Intro().fork(console.log.bind(console))
  t.end()
})
