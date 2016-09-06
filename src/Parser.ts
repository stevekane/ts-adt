export interface IResult<A> {
  success: true
  val: A
  rest: string
}

export interface IErr {
  success: false
  message: string
}

export class Result<A> implements IResult<A> {
  success: true = true
  constructor(public val: A, public rest: string) {} 
}

export class Err implements IErr {
  success: false = false
  constructor(public message: string) {}
}

export type Parser<A> = (s: string) => IResult<A> | IErr

export function unit<A> (a: A): Parser<A> {
  return (s: string) => new Result(a, s)
}

// export function fmap<A, B> (f: (a: A) => B, pa: Parser<A>): Parser<B> {
//   return flatMap(pa, a => unit(f(a)))
// }

export function flatMap<A, B> (pa: Parser<A>, f: (a: A) => Parser<B>): Parser<B> {
  return (s: string): IResult<B> | IErr => {
    const out = pa(s)

    switch (out.success) {
      case true:  return f(out.val)(out.rest)
      case false: return new Err(out.message) 
    }
  }
}

export function satisfy (f: (s: string) => boolean): Parser<string> {
  return function (rest: string): IResult<string> | IErr { 
    return f(rest) 
      ? new Result(rest.slice(0, 1), rest.slice(1)) 
      : new Err(`${ f.name } did not pass at ${ rest }`)
  }
}
