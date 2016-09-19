import { Maybe, Just, Nothing } from '../src/Maybe'

enum INS {
  CONST, //done
  PRINT, //done
  ADD, //done
  SUB, //done
  MUL, //done
  EQ, //done
  BR,
  BRT,
  BRF,
  LOAD,
  GLOAD,
  STORE,
  GSTORE,
  POP,
  CALL,
  RET,
  HALT
}

// I is instruction, T is Types
class VM<I, T> {
  sp: number = -1
  fp: number = 0
  ip: number = 0
  stack: T[] = []
  data: T[] = []
  code: I[]
  reg: [ T, T, T, T ]
  constructor(HEAP_SIZE: number, STACK_SIZE: number, registers: [ T, T, T, T ], code: I[]) {
    this.reg = registers
    this.code = code
    this.data = new Array(HEAP_SIZE).fill(0) as T[]
    this.stack = new Array(STACK_SIZE).fill(0) as T[]
  }
}

/*
  print(5 + 15 - 10)
*/
const program = [
  INS.CONST, 5,
  INS.CONST, 15,
  INS.ADD,
  INS.PRINT,
  INS.HALT
]
const vm = new VM(10, 20, [ 0, 0, 0, 0 ], program) as VM<INS, number>

function tick (vm: VM<INS, number>) {
  opcodes:
  while ( vm.ip < vm.code.length ) {
    const op = vm.code[vm.ip++]

    each:
    switch ( op ) {
      case INS.CONST: 
        vm.stack[++vm.sp] = vm.code[vm.ip++]
        break each
      case INS.PRINT:
        console.log(vm.stack[vm.sp])
        break each
      case INS.ADD:
        vm.reg[0] = vm.stack[vm.sp--]
        vm.reg[1] = vm.stack[vm.sp--]
        vm.reg[2] = vm.reg[1] + vm.reg[0]
        vm.stack[++vm.sp] = vm.reg[1]
        vm.stack[++vm.sp] = vm.reg[0]
        vm.stack[++vm.sp] = vm.reg[2]
        break each
      // Fetch from the heap
      case INS.GLOAD:
        vm.reg[0] = vm.code[++vm.ip]
        vm.reg[1] = vm.data[vm.reg[0]]
        vm.stack[vm.sp++] = vm.reg[0]
        break each
      // Write to the heap
      case INS.GSTORE:
        vm.reg[0] = vm.stack[vm.sp--]
        vm.reg[1] = vm.code[++vm.ip]
        vm.data[vm.reg[1]] = vm.reg[0]
        vm.stack[vm.sp++] = vm.reg[0]
        break each

      // End execution
      case INS.HALT: 
        break opcodes
      default:       
        break each
    }  
  }
  console.log(vm)
}

tick(vm)
