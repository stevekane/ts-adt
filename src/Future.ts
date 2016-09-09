import { Monad } from './TypeClassInterfaces'
import { concat } from './utils'

type ForkFn<T> = (r: (t: T) => void) => void

export class Future<A> implements Monad<A> { 
  constructor(public fork: ForkFn<A>) {}

  static unit<B> (b: B): Future<B> {
    return new Future(r => r(b))
  }

  static map2<A, B, R> (fn: (a: A, b: B) => R, fA: Future<A>, fB: Future<B>): Future<R> {
    return fA.chain(a => fB.chain(b => Future.unit(fn(a, b))))
  }

  static sequence<A> (fs: Future<A>[]): Future<A[]> {
    const [ t, ...remaining ] = fs

    if ( fs.length === 0 ) return Future.unit([]) 
    else                   return Future.map2(concat, t, Future.sequence(remaining))
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
