type RunFn<A> = (f: (a: A) => void) => void

export interface ICont<A> { 
  run: RunFn<A>
}

export class Cont<A> implements ICont<A> {
  constructor(public run: RunFn<A>) {}
}

export function unit<A> (a: A): ICont<A> {
  return new Cont((f: (a: A) => void) => f(a))
}

export function fmap<A, B> (f: (a: A) => B, cA: ICont<A>): ICont<B> {
  return new Cont(r => cA.run(a => unit(f(a)).run(r)))
}

export function flatMap<A, B> (cA: ICont<A>, f: (a: A) => ICont<B>): ICont<B> {
  return new Cont(r => cA.run(a => f(a).run(r)))
}
