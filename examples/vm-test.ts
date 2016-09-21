import * as test from 'tape'
import { VM, INS, step } from './vm'

function toName (i: INS): string {
  switch ( i ) {
    case INS.CONST:  return 'CONST' 
    case INS.ADD:    return 'ADD' 
    case INS.EQ:     return 'EQ' 
    case INS.LOAD:   return 'LOAD' 
    case INS.STORE:  return 'STORE' 
    case INS.CALL:   return 'CALL' 
    case INS.RET:    return 'RET' 
    default:         return 'UNKNOWN OP'
  }
}

function traceVM (ins: number, vm: VM<INS, number>) {
  const op = `OP: ${ toName(ins) }`
  const stack = `STACK: ${ vm.stack.slice(0, vm.sp + 1).join(' ') }`

  console.log([ op, stack ].join('\n') + '\n')
}

function run (vm: VM<INS, number>) {
  while (vm.ip >= 0 && vm.ip < vm.code.length) {
    const op = vm.code[vm.ip]

    step(vm) 
    traceVM(op, vm)
  }
}

test('VM', t => {
  const p1 = [
    // Add fn
    INS.LOAD, -4,
    INS.LOAD, -3,
    INS.ADD,
    INS.RET,
    // Main
    INS.CONST, 1,
    INS.CONST, 2,
    INS.CALL, 0, 2
  ]
  const vm: VM<INS, number> = {
    sp: -1,
    fp: 0,
    ip: 6, // main for p1
    stack: new Array(20).fill(0),
    code: p1
  }
  run(vm)

  t.same(vm.stack[vm.sp], 3)
  t.end()
})
