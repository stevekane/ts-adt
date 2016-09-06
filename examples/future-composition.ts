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
    age: Math.floor(Math.random() * 32),
    provider: 'Mercy'
  }))
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
const program = fetchPatientData(patientId)                                                                                                                      // Fetch patient data
                .chain(initialPatientData => Intro()                                                                                                             // Show the intro sequence
                .chain(_ => WorkSheet(initialPatientData))                                                                                                       // Ask patient to update their info
                .chain(updatedPatientData => (updatedPatientData.age < 18 ? MinorOutro(updatedPatientData.firstName) : AdultOutro(updatedPatientData.firstName)) // Choose correct outro based on age
                .chain(_2 => Future.unit({ patientData: updatedPatientData, risks: [] }))))                                                                      // Gather up collected data and return as result of running the program

program.fork(console.log.bind(console))
