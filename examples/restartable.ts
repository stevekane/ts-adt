var f = (): Promise<number> => Promise.resolve(Math.random() * 10)
var g = (): Promise<string> => Promise.resolve('Arkvid')

/*
  A module is any function from I => Promise<O>

  Since these functions compose via the .then continuation function,
  a module is therefore also:

  m1(m1in)
    .then(m1out => m2(m2in))
  
  and it follows:

  m1(m1in)
    .then(m1out => m2(m2in)
      .then(m2out => m3(m3in)))

  is also a module.

  if our language didn't suck, we would define modules as follows:

  type Mod a b c 
    = Seq a b
    | Seq a b >>= Mod b c

  but it does suck, so you'll just have to pretend
*/

// This module gathers age and then name and repeats forever until age is less than 5.  because reasons.
function mod0 (): Promise<number> {
  return f().then(age => {
    function mod1 (): Promise<string> { 
      return g().then(name => {
        var mod2Bot = (): Promise<{ age: number, name: string }> => Promise.resolve({ age, name })

        if ( age > 5 ) return mod0()
        else           return mod2Bot()
      })          
    }
    return mod1()
  })
}

mod0().then(console.log.bind(console))
