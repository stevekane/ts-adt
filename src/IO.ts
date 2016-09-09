import { Monad } from './TypeClassInterfaces'

export class IO<A> implements Monad<A> {
  constructor(public run: () => A) {}

  static unit<B> (b: B): IO<B> {
    return new IO(() => b) 
  }

  of<B> (b: B): IO<B> {
    return new IO(() => b)
  }

  chain<B> (f: (a: A) => IO<B>): IO<B> {
    return f(this.run())
  }

  map<B> (f: (a: A) => B): IO<B> {
    return this.chain(a => IO.unit(f(a)))
  }
}
