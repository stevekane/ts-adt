export interface IJust<A> {
  kind: 'Just',
  val: A
}
export interface INothing {
  kind: 'Nothing' 
}

export class Just<A> implements IJust<A> {
  kind: 'Just' = 'Just'
  constructor(public val: A) {} 
}
export class Nothing implements INothing {
  kind: 'Nothing' = 'Nothing' 
  constructor() {}
}

export type Maybe<A> = IJust<A> | INothing

export function fmap<A, B> ( fn: (a: A) => B, mA: Maybe<A> ): Maybe<B> {
  switch ( mA.kind ) {
    case 'Just':    return new Just(fn(mA.val)) 
    case 'Nothing': return new Nothing
  }
}

export function flatMap<A, B> ( fn: (a: A) => Maybe<B>, mA: Maybe<A> ): Maybe<B> {
  switch ( mA.kind ) {
    case 'Just':    return fn(mA.val)
    case 'Nothing': return new Nothing
  } 
}

export function unit<A> (a: A): Maybe<A> {
  return new Just(a) 
}
