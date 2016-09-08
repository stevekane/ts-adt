/// <reference path="../typings/index.d.ts" />

import { Future } from '../src/Future'

type PatientData = {
  firstName: string
  lastName: string
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

const log = console.log.bind(console)

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
  const msg = 'Fetching patient data from server...'

  return new Future(r => (log(msg), setTimeout(r, 1000, {
    firstName: 'Steve',
    lastName: 'Kane'
  })))
}

function Intro (): Future<number> {
  const duration = 2000
  const msg = 'Intro...'

  return new Future(r => (log(msg), setTimeout(r, duration, 1)))
}

function WorkSheet (patientData: PatientData): Future<PatientData> {
  const duration = 3000
  const msg = 'Asking patient to update their information...'

  return new Future(r => (log(msg), setTimeout(r, duration, {
    firstName: 'Steve',
    lastName: 'Kane',
    age: randIntRange(1, 32),
    provider: 'Mercy'
  })))
}

function DrugUseRatings (): Future<Rating[]> {
  const msg = 'Asking patient to rate their frequency of drug use...'

  return new Future(r => (log(msg), setTimeout(r, 5000, [
    { category: 'METH', value: randIntRange(0, 10) }, 
    { category: 'ALCOHOL', value: randIntRange(0, 10) },
    { category: 'MARIJUANA', value: randIntRange(0, 10) },
    { category: 'COCAINE', value: randIntRange(0, 10) },
    { category: 'HEROINE', value: randIntRange(0, 10) }
  ])))
}

function DrugRisk (rating: Rating): Future<number> {
  const duration = 3000
  const msg = `Informing patient of risks from frequent use of ${ rating.category }...`

  return new Future(r => (log(msg), setTimeout(r, duration, 1)))
}

function MinorOutro (firstName: string): Future<number> {
  const msg = 'Showing outro for a minor...'

  return new Future(r => (log(msg), setTimeout(r, 2000, 2)))
}

function AdultOutro (firstName: string): Future<number> {
  const msg = 'Showing outro for an adult...'

  return new Future(r => (log(msg), setTimeout(r, 3000, 2)))
}

function sequence<A> (fs: Future<A>[]): Future<A[]> {
  const [ t, ...remaining ] = fs

  if ( fs.length === 0 ) return Future.unit([]) 
  else                   return map2(concat, t, sequence(remaining))
}

function map2<A, B, R> (fn: (a: A, b: B) => R, fA: Future<A>, fB: Future<B>): Future<R> {
  return fA.chain(a => fB.chain(b => Future.unit(fn(a, b))))
}

const patientId = 5
const program
  = fetchPatientData(patientId)
    .chain(initialPatientData => Intro()
      .chain(_                  => WorkSheet(initialPatientData)
        .chain(updatedPatientData => DrugUseRatings()
          .chain(drugUseRatings     => sequence(drugUseRatings.sort(byValue).filter(onlyHigh).map(DrugRisk))
            .chain(_                  => (updatedPatientData.age < 18 ? MinorOutro : AdultOutro)(updatedPatientData.firstName)
              .chain(_                  => Future.unit({ patientData: updatedPatientData, highRisks: drugUseRatings.filter(onlyHigh) })))))))

program.fork(log.bind(console))
