enum INS { CONST, ADD, EQ, LOAD, STORE, CALL, RET } 

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

interface VM<I, T> {
  sp: number
  fp: number
  ip: number
  stack: T[]
  code: I[]
  reg: [ T, T, T, T ]
}

function traceVM<I, T> (ins: number, vm: VM<I, T>) {
  const op = `OP: ${ toName(ins) }`
  const stack = `STACK: ${ vm.stack.slice(0, vm.sp + 1).join(' ') }`

  console.log([ op, stack ].join('\n') + '\n')
}

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
  code: p1,
  reg: [ 0, 0, 0, 0 ]
}

function tick (vm: VM<INS, number>) {
  while ( vm.ip >= 0 && vm.ip < vm.code.length ) {
    const op = vm.code[vm.ip]

    switch ( op ) {
      case INS.CONST: 
        vm.stack[++vm.sp] = vm.code[vm.ip + 1]
        vm.ip += 2
        break
      case INS.ADD:
        vm.reg[0] = vm.stack[vm.sp--]
        vm.reg[1] = vm.stack[vm.sp--]
        vm.reg[2] = vm.reg[1] + vm.reg[0]
        vm.stack[++vm.sp] = vm.reg[2]
        vm.ip++
        break
      case INS.EQ:
        vm.reg[0] = vm.stack[vm.sp--]
        vm.reg[1] = vm.stack[vm.sp--]
        vm.reg[2] = vm.reg[1] == vm.reg[0] ? 1 : 0
        vm.stack[++vm.sp] = vm.reg[2]
        vm.ip++
        break
      case INS.CALL:
        vm.reg[0] = vm.code[++vm.ip]
        vm.reg[1] = vm.code[++vm.ip]
        vm.stack[++vm.sp] = vm.reg[1]
        vm.stack[++vm.sp] = vm.fp
        vm.stack[++vm.sp] = vm.ip + 1
        vm.fp = vm.sp
        vm.ip = vm.reg[0]
        break
      case INS.RET:
        vm.reg[0] = vm.stack[vm.sp--]
        vm.sp = vm.fp
        vm.ip = vm.stack[vm.sp--]
        vm.fp = vm.stack[vm.sp--]
        vm.reg[1] = vm.stack[vm.sp--]
        vm.sp -= vm.reg[1]
        vm.stack[++vm.sp] = vm.reg[0]
        break
      case INS.LOAD:
        vm.reg[0] = vm.code[++vm.ip]
        vm.stack[++vm.sp] = vm.stack[vm.fp + vm.reg[0]]
        vm.ip++
        break
      case INS.STORE:
        vm.reg[0] = vm.code[vm.ip++] // offset
        vm.reg[1] = vm.stack[vm.sp--] // value off stack to store
        vm.stack[vm.fp + vm.reg[0]] = vm.reg[1]
        break
      default:       
        throw new Error('Unexpected Operation.... Should be un-reachable')
    }  
    traceVM(op, vm)
  }
}

tick(vm)
console.log(vm.stack[vm.sp])
