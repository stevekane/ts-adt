export interface IIO<A> {
  run: () => A
}

export class IO<A> implements IIO<A> {
  constructor(public run: () => A) {}
}

export function fmap<A, B> (fn: (a: A) => B, ioA: IIO<A>): IIO<B> {
  return new IO(() => fn(ioA.run()))
}

export function flatMap<A, B> (ioA: IIO<A>, fn: (a: A) => IIO<B>): IIO<B> {
  return fn(ioA.run())
}

export function unit<A> (a: A): IIO<A> {
  return new IO(() => a)
}
