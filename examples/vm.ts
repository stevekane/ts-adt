export interface VM {
  sp: number
  fp: number
  ip: number
  stack: any[]
  code: INS[]
}

export interface INS { 
  run(vm: VM): void
}

export namespace Instructions {
  export class CONST implements INS { 
    constructor(public val: any) {}
    run(vm: VM) {
      vm.stack[++vm.sp] = this.val
      vm.ip++
    }
  }

  export class ADD implements INS {
    run(vm: VM) {
      const right = vm.stack[vm.sp--]
      const left = vm.stack[vm.sp--]

      vm.stack[++vm.sp] = left + right
      vm.ip++
    }
  }

  export class EQ implements INS {
    run(vm: VM) {
      const eq = vm.stack[vm.sp--] == vm.stack[vm.sp--] ? 1 : 0

      vm.stack[++vm.sp] = eq
      vm.ip++
    }
  }

  export class CALL implements INS {
    constructor(public fnAddr: number, public numArgs: number) {}
    run(vm: VM) {
      vm.stack[++vm.sp] = this.numArgs
      vm.stack[++vm.sp] = vm.fp
      vm.stack[++vm.sp] = vm.ip + 1
      vm.fp = vm.sp
      vm.ip = this.fnAddr
    }
  }

  export class RET implements INS {
    run(vm: VM) {
      const val = vm.stack[vm.sp--]

      vm.sp = vm.fp
      vm.ip = vm.stack[vm.sp--]
      vm.fp = vm.stack[vm.sp--]
      const argCount = vm.stack[vm.sp--]
      vm.sp -= argCount
      vm.stack[++vm.sp] = val
    }
  }

  export class LOAD implements INS {
    constructor(public offset: number) {}
    run(vm: VM) {
      vm.stack[++vm.sp] = vm.stack[vm.fp + this.offset]
      vm.ip++
    }
  }

  export class STORE implements INS {
    constructor(public offset: number) {}
    run(vm: VM) {
      const val = vm.stack[vm.sp--]

      vm.stack[vm.fp + this.offset] = val
    }
  }
}
