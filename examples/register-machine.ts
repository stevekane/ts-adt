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


// CONST
export class CONST_NUM {
  kind: 'CONST_NUM' = 'CONST_NUM'
  constructor(public val: number, public t: number) {}
}

export class CONST_STR {
  kind: 'CONST_STR' = 'CONST_STR'
  constructor(public val: string, public t: number) {}
}

export class CONST_BOOL {
  kind: 'CONST_BOOL' = 'CONST_BOOL'
  constructor(public val: boolean, public t: number) {}
}


// PRINT
export class PRINT_STR {
  kind: 'PRINT_STR' = 'PRINT_STR'
  constructor(public f: number) {}
}

export class PRINT_NUM {
  kind: 'PRINT_NUM' = 'PRINT_NUM'
  constructor(public f: number) {}
}

export class PRINT_BOOL {
  kind: 'PRINT_BOOL' = 'PRINT_BOOL'
  constructor(public f: number) {}
}


// MAPPEND ( concat, add, && )
export class MAPPEND_STR {
  kind: 'MAPPEND_STR' = 'MAPPEND_STR'
  constructor(public f1: number, public f2: number, public t: number) {}
}

export class MAPPEND_NUM {
  kind: 'MAPPEND_NUM' = 'MAPPEND_NUM'
  constructor(public f1: number, public f2: number, public t: number) {}
}

export class MAPPEND_BOOL {
  kind: 'MAPPEND_BOOL' = 'MAPPEND_BOOL'
  constructor(public f1: number, public f2: number, public t: number) {}
}

export class HALT {
  kind: 'HALT' = 'HALT'
}

type CONST = CONST_STR | CONST_NUM | CONST_BOOL
type PRINT = PRINT_STR | PRINT_NUM | PRINT_BOOL
type MAPPEND = MAPPEND_STR | MAPPEND_NUM | MAPPEND_BOOL
type INS = CONST | PRINT | MAPPEND | HALT

const p = [
  new CONST_STR('hello', 0), 
  new CONST_STR('world', 1),
  new MAPPEND_STR(0, 1, 2),
  new PRINT_STR(0),
  new HALT
]
const vm = new RegVM(0, p)

function step(vm: IRegisterVM) {
  const ins = vm.code[vm.ip++]

  if      ( ins.kind == 'CONST_NUM' )    vm.num[ins.t] = ins.val
  else if ( ins.kind == 'CONST_STR' )    vm.str[ins.t] = ins.val
  else if ( ins.kind == 'CONST_BOOL')    vm.bool[ins.t] = ins.val
  else if ( ins.kind == 'MAPPEND_NUM' )  vm.num[ins.t] = vm.num[ins.f1] + vm.num[ins.f2]
  else if ( ins.kind == 'MAPPEND_STR' )  vm.str[ins.t] = vm.str[ins.f1] + vm.str[ins.f2]
  else if ( ins.kind == 'MAPPEND_BOOL' ) vm.bool[ins.t] = vm.bool[ins.f1] && vm.bool[ins.f2]
  else if ( ins.kind == 'PRINT_NUM' )    console.log(vm.num[ins.f]) 
  else if ( ins.kind == 'PRINT_STR' )    console.log(vm.str[ins.f])
  else if ( ins.kind == 'PRINT_BOOL' )   console.log(vm.bool[ins.f])
  else                                   vm.ip = -1
}

while ( vm.ip >= 0 && vm.ip < vm.code.length ) step(vm)

console.log(vm)
