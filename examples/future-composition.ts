/// <reference path="../typings/index.d.ts" />

import { Future } from '../src/Future'

/*
  In this world, all entities are Futures and thusly are interface-wise
  indistinguishable from one-another.  The base parts are
  1.  Scene 
  2.  LogicNode
  3.  OrderedFlow
  4.  Sequential Compositions of Any of these
*/

type PatientData = {
  firstName: string
  lastname: string
  age?: number
  provider?: string
}
type DRUG_CATEGORY
  = 'METH'
  | 'ALCOHOL'
  | 'MARIJUANA'
  | 'COCAINE'
  | 'HEROINE'

interface Rating { 
  category: DRUG_CATEGORY
  value: number
}

function randIntRange (min: number, max: number): number {
  return min + Math.round(Math.random() * (max - min))
}

function concat<A> (a: A, list: A[]): A[] {
  return list.concat(a)
}

function byValue (a: { value: number }, b: { value: number }): number {
  return a.value - b.value
}

function onlyHigh (a: { value: number }): boolean {
  return a.value > 5
}


function fetchPatientData (id: number): Future<PatientData> {
  console.log('Fetching patient data from server...')
  return new Future(r => setTimeout(r, 1000, {
    firstName: 'Steve',
    lastName: 'Kane'
  }))
}

function DrugRisk (rating: Rating): Future<number> {
  const duration = 3000
  const msg = `Informing patient of risks from frequent use of ${ rating.category }...`

  return new Future(r => (console.log(msg), setTimeout(r, duration, 1)))
}

function Intro (): Future<number> {
  const duration = 2000

  console.log(`Intro...`)
  return new Future(r => { setTimeout(r, duration, 1) })
}

function WorkSheet (patientData: PatientData): Future<PatientData> {
  const duration = 3000

  console.log(`Asking patient to update their information...`)
  return new Future(r => setTimeout(r, duration, {
    firstName: 'Steve',
    lastName: 'Kane',
    age: randIntRange(1, 32),
    provider: 'Mercy'
  }))
}

function DrugUseRatings (): Future<Rating[]> {
  console.log('Asking patient to rate their frequency of drug use...')
  return new Future(r => setTimeout(r, 5000, [
    { category: 'METH', value: randIntRange(0, 10) }, 
    { category: 'ALCOHOL', value: randIntRange(0, 10) },
    { category: 'MARIJUANA', value: randIntRange(0, 10) },
    { category: 'COCAINE', value: randIntRange(0, 10) },
    { category: 'HEROINE', value: randIntRange(0, 10) }
  ]))
}

function MinorOutro (firstName: string): Future<number> {
  console.log('Showing outro for a minor')
  return new Future(r => { setTimeout(r, 2000, 2) })
}

function AdultOutro (firstName: string): Future<number> {
  console.log('Showing outro for an adult')
  return new Future(r => setTimeout(r, 3000, 2))
}

function sequence<A> (fs: Future<A>[]): Future<A[]> {
  const [ t, ...remaining ] = fs

  if ( fs.length === 0 ) return Future.unit([]) 
  else                   return map2(concat, t, sequence(remaining))
}

function map2<A, B, R> (fn: (a: A, b: B) => R, fA: Future<A>, fB: Future<B>): Future<R> {
  return fA.chain(a => fB.chain(b => Future.unit(fn(a, b))))
}

/*
sequence : List (Task x a) -> Task x (List a)
sequence tasks =
  case tasks of 
    []                     -> succeed []
    task :: remainingTasks -> map2 (::) task (sequence remainingTasks)

  map2 : (a -> b -> result) -> Task x a -> Task x b -> Task x result
  map2 func taskA taskB =
    taskA
      `andThen` \a -> taskB
      `andThen` \b -> succeed (func a b)
*/

const patientId = 5
const program = fetchPatientData(patientId)
                .chain(initialPatientData => Intro()
                .chain(_ => WorkSheet(initialPatientData)
                .chain(updatedPatientData => DrugUseRatings()
                .chain(drugUseRatings => sequence(drugUseRatings.sort(byValue).filter(onlyHigh).map(DrugRisk))
                .chain(_2 => (updatedPatientData.age < 18 ? MinorOutro(updatedPatientData.firstName) : AdultOutro(updatedPatientData.firstName))
                .chain(_3 => Future.unit({ patientData: updatedPatientData, risks: drugUseRatings })))))))

program.fork(console.log.bind(console))
