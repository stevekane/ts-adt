import { Monad } from './TypeClassInterfaces'

abstract class MBase<A> implements Monad<A> {
  of<B> (b: B): Maybe<B> {
    return new Just(b) 
  }

  chain<B> (fn: (a: A) => Maybe<B>): Maybe<B> {
    if ( this instanceof Just ) return fn(this.val)
    else                        return new Nothing
  }

  map<B> (f: (a: A) => B): Maybe<B> {
    return this.chain(a => unit(f(a)))
  }
}

export class Just<A> extends MBase<A> {
  kind: 'Just' = 'Just'
  val: A
  constructor(val: A) {
    super()
    this.val = val
  }
}

export class Nothing<A> extends MBase<A> {
  kind: 'Nothing' = 'Nothing' 
}

export type Maybe<A> = Just<A> | Nothing<A>

export function unit<A> (a: A): Maybe<A> {
  return new Just(a) 
}
