import { RunFn, ICont, Cont, unit, flatMap } from '../src/Continuation'

const initial = new Cont([ stack: any[], a: A ] =>
