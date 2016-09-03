const MIN_TIME = 1 //ms

type ForkFn<T> = (r: (t: T) => void) => void

export interface IFuture<A> {
  fork: ForkFn<A>
}

export class Future<A> implements IFuture<A> { 
  constructor(public fork: ForkFn<A>) {}
}

export function fmap<A, B> (fn: (a: A) => B, mA: IFuture<A>): IFuture<B> {
  return new Future((rO) => mA.fork((rI) => rO(fn(rI))))
}

export function flatMap<A, B> (fn: (a: A) => IFuture<B>, mA: IFuture<A>): IFuture<B> {
  return new Future((rO) => mA.fork((rI) => fn(rI).fork(rO)))
}

export function unit <A> (a: A): IFuture<A> {
  return new Future((r) => setTimeout(r, MIN_TIME, a))
}
