import { Monad } from './TypeClassInterfaces'

type RunFn<A> = (f: (a: A) => void) => void

export class Cont<A> implements Monad<A> {
  constructor(public run: RunFn<A>) {}

  static unit<A> (a: A): Cont<A> {
    return new Cont((f: (a: A) => void) => f(a))
  }

  chain<B> (f: (a: A) => Cont<B>): Cont<B> {
    const cA = this

    return new Cont(r => cA.run(a => f(a).run(r)))
  }

  map<B> (f: (a: A) => B): Cont<B> {
    return this.chain(a => Cont.unit(f(a)))
  }

  of<B> (b: B): Cont<B> {
    return new Cont((f: (b: B) => void) => f(b)) 
  }
}
