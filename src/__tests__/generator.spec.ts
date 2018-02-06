import Tokeniser from '../tokeniser'
import Lexer from '../lexer'
import Generator from '../generator'

describe('Code generator', () => {
  test('it compiles a function to javascript', () => {
    const result = Generator(
      Lexer(
        Tokeniser(`x="test"
    main x y => { x+1 }`)
      )
    )
    console.log(result)
  })
})
