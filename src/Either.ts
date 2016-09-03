export interface IRight<A> {
  success: true
  val: A
}

export interface ILeft<A> {
  success: false
  message: A
}

export class Success<A> implements IRight<A> {
  success: true = true
  constructor(public val: A) {}
}

export class Failure<A> implements ILeft<A> {
  success: false = false 
  constructor(public message: A) {}
}

export type Either<A, B> = ILeft<A> | IRight<B>

export function fmap<A, B, L> ( fn: (a: A) => B, mA: Either<L, A> ): Either<L, B> {
  switch ( mA.success ) {
    case true:  return new Success(fn(mA.val)) 
    case false: return new Failure(mA.message)
  }
}

export function flatMap<A, B, L> ( fn: (a: A) => Either<L, B>, mA: Either<L, A> ): Either<L, B> {
  switch ( mA.success ) {
    case true:  return fn(mA.val)
    case false: return new Failure(mA.message)
  } 
}

export function unit<L, A> (a: A): Either<L, A> {
  return new Success(a)
}
