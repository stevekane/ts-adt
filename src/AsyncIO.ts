const MIN_TIME = 1 // ms

type RunFn<T> = (r: (t: T) => void) => void

export interface IAsyncIO<T> {
  run: RunFn<T>
}

export class AsyncIO<T> implements IAsyncIO<T> {
  constructor(public run: RunFn<T>) {}
}

export function unit<T> (t: T): IAsyncIO<T> {
  return new AsyncIO(r => setTimeout((_: void) => r(t), MIN_TIME))
}

export function flatMap<A, B> (iA: IAsyncIO<A>, f: (a: A) => IAsyncIO<B>): IAsyncIO<B> {
  return new AsyncIO(rO => iA.run(rI => f(rI).run(rO)))
}

export function fmap<A, B> (f: (a: A) => B, iA: IAsyncIO<A>): IAsyncIO<B> {
  return new AsyncIO(rO => iA.run(rI => rO(f(rI))))
}
