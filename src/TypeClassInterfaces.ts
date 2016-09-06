export interface Functor <A> {
  map<B> (fn: (a: A) => B): Functor<B>
}

export interface Monad<A> extends Functor<A> {
  of<B>(b: B): Monad<B>
  chain<B>(fn: (a: A) => Monad<B>): Monad<B>
}
