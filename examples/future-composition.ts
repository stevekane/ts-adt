/// <reference path="../typings/index.d.ts" />

import { Future } from '../src/Future'
import { log, randIntRange } from '../src/utils'

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

const patientId = 5
const program
  = fetchPatientData(patientId)
    .chain(initialPatientData => Intro()
      .chain(_                  => WorkSheet(initialPatientData)
        .chain(updatedPatientData => DrugUseRatings()
          .chain(drugUseRatings     => Future.sequence(drugUseRatings.sort((a, b) => a.value - b.value).filter(r => r.value >= 5).map(DrugRisk))
            .chain(_                  => (updatedPatientData.age < 18 ? MinorOutro : AdultOutro)(updatedPatientData.firstName)
              .chain(_                  => Future.unit({ patientData: updatedPatientData, highRisks: drugUseRatings.filter(r => r.value > 5) })))))))

program.fork(log)
