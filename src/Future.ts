import { Monad } from './TypeClassInterfaces'

type ForkFn<T> = (r: (t: T) => void) => void

export class Future<A> implements Monad<A> { 
  constructor(public fork: ForkFn<A>) {}

  static unit<B> (b: B): Future<B> {
    return new Future(r => r(b))
  }

  map<B>(fn: (a: A) => B): Future<B> {
    const mA = this

    return new Future(rO => mA.fork(rI => rO(fn(rI))))
  }

  chain<B>(fn: (a: A) => Future<B>): Future<B> {
    const mA = this 

    return new Future(rO => mA.fork(rI => fn(rI).fork(rO)))
  }

  of<B> (b: B): Future<B> {
    return new Future(r => r(b))
  }
}
