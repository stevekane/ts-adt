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

type Rating = { category: string, value: number }

function randIntRange (min: number, max: number): number {
  return min + Math.round(Math.random() * (max - min))
}

function fetchPatientData (id: number): Future<PatientData> {
  console.log('Fetching patient data from server...')
  return new Future(r => setTimeout(r, 1000, {
    firstName: 'Steve',
    lastName: 'Kane'
  }))
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
    { category: 'meth', value: randIntRange(0, 10) }, 
    { category: 'alchohol', value: randIntRange(0, 10) }
  ]))
}

function MinorOutro (firstName: string): Future<number> {
  console.log('Showing outro for a minor')
  return new Future(r => { setTimeout(r, 2000, 2) })
}

function AdultOutro (firstName: string): Future<number> {
  console.log('Showing outro for an adult')
  return new Future(r => { setTimeout(r, 3000, 2) })
}

const patientId = 5
const program = fetchPatientData(patientId)
                .chain(initialPatientData => Intro()
                .chain(_ => WorkSheet(initialPatientData)
                .chain(updatedPatientData => DrugUseRatings()
                .chain(drugUseRatings => (updatedPatientData.age < 18 ? MinorOutro(updatedPatientData.firstName) : AdultOutro(updatedPatientData.firstName))
                .chain(_2 => Future.unit({ patientData: updatedPatientData, risks: drugUseRatings.sort((a, b) => a.value - b.value) }))))))

program.fork(console.log.bind(console))
