type RunFn<I, O> = (i: I) => [ O, IMealy<I, O> ]

export interface IMealy<I, O> {
  run: RunFn<I, O>
}

export class Mealy<I, O> implements IMealy<I, O> {
  constructor(public run: RunFn<I, O>) {}    
}

export function unit<I, O> (o: O): IMealy<I, O> {
  var r: IMealy<I, O> = new Mealy((i: I) => [ o, r ])

  return r
}

export function flatMap<I, A, B> (mA: IMealy<I, A>, f: (a: A) => IMealy<I, B>): IMealy<I, B> {
  return new Mealy((i: I) => {
    const [ a, mAPrime ] = mA.run(i)
    const out: [ B, IMealy<I, B> ] = [ f(a).run(i)[0], flatMap(mAPrime, f) ]

    return out
  })
}

export function fmap<I, A, B> (f: (a: A) => B, mA: IMealy<I, A>): IMealy<I, B> {
  return flatMap(mA, a => unit(f(a)))
}
