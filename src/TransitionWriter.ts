import { IFuture } from './Future'

type ForkFn<A, B> = (r: (o: [ A, B ]) => void) => void
type SnapshotFn<A> = (a: A) => IFuture<null>
type RecordFn<B> = (b: B) => IFuture<null>

export interface ITransitionWriter<A, B> {
  record: RecordFn<A>
  snapshot: SnapshotFn<B>
  fork: ForkFn<A, B>
}

export class TransitionWriter<A, B> implements ITransitionWriter<A, B> {
  constructor(public record: RecordFn<A>, public snapshot: SnapshotFn<B>, public fork: ForkFn<A, B>) {}
}

// export function flatMap<L, A, B> (mA: ITransitionWriter<L, A>, fn: (a: A) => ITransitionWriter<L, B>): ITransitionWriter<L, B> {
//   return new TransitionWriter(rO => mA.fork(rI => fn(rI).fork(rO)))
// }

// export function unit<A, B> (a: A): ITransitionWriter<A, B> {
//   return new TransitionWriter(r => setTimeout(r, MIN_TIME, b))
// }
