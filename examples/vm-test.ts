import * as test from 'tape'
import { VM, INS, Instructions } from './vm'

test('VM', t => {
  const p = [
    // fn add
    new Instructions.LOAD(-4),
    new Instructions.LOAD(-3),
    new Instructions.ADD,
    new Instructions.RET,
    // main
    new Instructions.CONST('CAT'),
    new Instructions.CONST('BERT'),
    new Instructions.CALL(0, 2)
  ]
  const vm = {
    sp: -1,
    fp: 0,
    ip: 4,
    stack: new Array(20).fill(0),
    code: p
  }

  while ( vm.ip >= 0 && vm.ip < vm.code.length ) {
    vm.code[vm.ip].run(vm)
  }
  t.same(vm.stack[vm.sp], 'CATBERT')
  t.end()
})
