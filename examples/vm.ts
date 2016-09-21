export enum INS { CONST, ADD, EQ, LOAD, STORE, CALL, RET } 

export interface VM<I, T> {
  sp: number
  fp: number
  ip: number
  stack: T[]
  code: I[]
}

/*
Eliminate reg
Eliminate fixed-size stack
Eliminate sp?
INS Should be interface-satisfying classes?
*/

export function step (vm: VM<INS, number>) {
  switch ( vm.code[vm.ip] ) {
    case INS.CONST: 
      vm.stack[++vm.sp] = vm.code[vm.ip + 1]
      vm.ip += 2 // Could change above to ++ and here to ++
      break
    case INS.ADD:
      var sum = vm.stack[vm.sp--] + vm.stack[vm.sp--]
      vm.stack[++vm.sp] = sum
      vm.ip++
      break
    case INS.EQ:
      var eq = vm.stack[vm.sp--] == vm.stack[vm.sp--] ? 1 : 0
      vm.stack[++vm.sp] = eq
      vm.ip++
      break
    case INS.CALL:
      var fromAddr = vm.code[++vm.ip]
      var numArgs = vm.code[++vm.ip]
      vm.stack[++vm.sp] = numArgs
      vm.stack[++vm.sp] = vm.fp
      vm.stack[++vm.sp] = vm.ip + 1
      vm.fp = vm.sp
      vm.ip = fromAddr
      break
    case INS.RET:
      var val = vm.stack[vm.sp--]
      vm.sp = vm.fp
      vm.ip = vm.stack[vm.sp--]
      vm.fp = vm.stack[vm.sp--]
      var argCount = vm.stack[vm.sp--]
      vm.sp -= argCount
      vm.stack[++vm.sp] = val
      break
    case INS.LOAD:
      var offset = vm.code[++vm.ip]
      vm.stack[++vm.sp] = vm.stack[vm.fp + offset]
      vm.ip++
      break
    case INS.STORE:
      var offset = vm.code[vm.ip++]
      var val = vm.stack[vm.sp--]
      vm.stack[vm.fp + offset] = val
      break
    default:       
      throw new Error('Unexpected Operation.... Should be un-reachable')
  }  
}
