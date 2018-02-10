import Tokeniser from '../tokeniser'
import Lexer from '../lexer'
import Generator from '../generator'

describe('Code generator', () => {
  test('it compiles a function to javascript', () => {
    expect(
      Generator(
        Lexer(
          Tokeniser(
            `test = 1 + 1 - "test"\nmain x y => { \n\t"text"\n}\nmain 1 2`
          )
        )
      )
    ).toEqual(
      'var test = 1 + 1 - "test"\nconst main = x => y => {\n\treturn "text"\n}\nmain(1)(2)'
    )
  })
})
