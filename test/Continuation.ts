import * as test from 'tape'
import { Cont } from '../src/Continuation'

test('Continuation', t => {
  type KeyCode = number
  type App = {
    dimensions: [ number, number ]
    keyCode: KeyCode
  }

  interface IResize { 
    kind: 'resize'
    dimensions: [ number, number ]
  }
  interface IKeyDown {
    kind: 'keydown'
    keyCode: KeyCode
  }
  type WindowCallback = IResize | IKeyDown

  const u5 = Cont.unit(5)
  const fMapped = Cont.unit(5).map(v => v + 5)
  const flatMapped = Cont.unit(5).chain(v => Cont.unit(v + 5))
  const userCallbacks = (app: App, cb: WindowCallback): Cont<App> => {
    switch ( cb.kind ) {
      case 'resize':  return Cont.unit(Object.assign(app, { dimensions: cb.dimensions }))
      case 'keydown': return Cont.unit(Object.assign(app, { keyCode: cb.keyCode }))
    }
  }
  const app = {
    dimensions: [ 0, 0 ] as [ number, number ],
    keyCode: 0
  }
  const keydown = {
    kind: 'keydown' as 'keydown',
    keyCode: 5
  }
  const resize = {
    kind: 'resize' as 'resize',
    dimensions: [ 640, 480 ] as [ number, number ]
  }

  u5.run(v => t.same(v, 5))
  fMapped.run(v => t.same(v, 10))
  flatMapped.run(v => t.same(v, 10))
  userCallbacks(app, keydown).run(a => t.same(a.keyCode, 5))
  userCallbacks(app, resize).run(a => t.same(a.dimensions, [ 640, 480 ]))
  t.end()
})
