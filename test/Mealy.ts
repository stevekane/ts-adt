import * as test from 'tape'
import { IMealy, Mealy, unit, flatMap, fmap } from '../src/Mealy'

test('Mealy', t => {
  enum Animal {
    Cow,
    Horse,
    Dog
  }
  const u: IMealy<number, number> = unit(5)
  const mb: IMealy<number, string> = flatMap(u, n => unit(n.toString()))
  const fb: IMealy<number, Animal> = fmap(n => n > 5 ? Animal.Cow : Animal.Dog, u)
  
  t.same(u.run(2)[0], 5)
  t.same(mb.run(2)[0], '5')
  t.same(fb.run(2)[0], Animal.Dog)
  t.end() 
})

test('Vending machine', t => {
  type Bill = 1 | 5 | 10
  type Drink = 'Water' | 'Pepsi' | 'Fanta'

  interface InsertBill { kind: 'insert', bill: Bill }
  interface SelectDrink { kind: 'select', drink: Drink }
  interface DisplayMessage { kind: 'message', message: string }
  interface DispenseDrink { kind: 'dispense', drink: Drink }
  interface ReturnBill { kind: 'return', bill: Bill }

  type Action = InsertBill | SelectDrink
  type Response = DisplayMessage | DispenseDrink | ReturnBill

  const insertBill = (bill: Bill): InsertBill => ({ kind: 'insert', bill })
  const selectDrink = (drink: Drink): SelectDrink => ({ kind: 'select', drink })
  const displayMessage = (message: string): DisplayMessage => ({ kind: 'message', message })
  const dispenseDrink = (drink: Drink): DispenseDrink => ({ kind: 'dispense', drink })
  const returnBill = (bill: Bill): ReturnBill => ({ kind: 'return', bill })

  var waitingForMoney: Mealy<Action, Response> = new Mealy((i: Action) => {
    if ( i.kind === 'insert' ) return [ displayMessage(`You inserted ${ i.bill } dollars`), drinkSelection ]
    else                       return [ displayMessage('Please insert a bill'), waitingForMoney ]
  })
  var drinkSelection: Mealy<Action, Response> = new Mealy((i: Action) => {
    if ( i.kind === 'insert' ) return [ returnBill(i.bill), drinkSelection ]
    else                       return [ dispenseDrink(i.drink), waitingForMoney ]
  })

  const s1 = waitingForMoney.run(insertBill(5))
  const s2 = s1[1].run(selectDrink('Pepsi'))

  console.log(s1[0], s2[0])
  t.end()
})
