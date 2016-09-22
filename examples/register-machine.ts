export type Primitive = number | string | boolean

export interface IRegisterVM {
  str: string[] 
  num: number[]
  bool: boolean[]
  code: INS[],
  ip: number
}

export class RegVM implements IRegisterVM {
  str = new Array(10).fill('')
  num = new Array(10).fill(0)
  bool = new Array(10).fill(false)
  constructor(public ip: number, public code: INS[]) {}
}

export class CONST {
  kind: 'CONST' = 'CONST'
  constructor(public val: Primitive, public t: number) {}
}

export class PRINT_STR {
  kind: 'PRINT_STR' = 'PRINT_STR'
  constructor(public f: number) {}
}

export class CONCAT_STR {
  kind: 'CONCAT_STR' = 'CONCAT_STR'
  constructor(public f1: number, public f2: number, public t: number) {}
}

export class HALT {
  kind: 'HALT' = 'HALT'
}

type INS 
  = CONST
  | PRINT_STR
  | CONCAT_STR
  | HALT

const p = [
  new CONST('hello', 0), 
  new CONST('world', 1),
  new CONCAT_STR(0, 1, 2),
  new PRINT_STR(0),
  new HALT
]
const vm = new RegVM(0, p)

function step(vm: IRegisterVM) {
  const ins = vm.code[vm.ip++]

  if ( ins.kind == 'CONST' ) {
    if      ( typeof ins.val == 'string' )  vm.str[ins.t] = ins.val
    else if ( typeof ins.val == 'boolean' ) vm.bool[ins.t] = ins.val
    else                                    vm.num[ins.t] = ins.val
  }
  else if ( ins.kind == 'PRINT_STR' )       console.log(vm.str[ins.f])
  else if ( ins.kind == 'CONCAT_STR' )      vm.str[ins.t] = vm.str[ins.f1] + vm.str[ins.f2]
  else                                      vm.ip = -1
}

while ( vm.ip >= 0 && vm.ip < vm.code.length ) step(vm)

console.log(vm)
