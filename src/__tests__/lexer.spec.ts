import Tokeniser from '../tokeniser'
import Lexer, { parseFunction } from '../lexer'

describe.only('Lexec', () => {
  test('it generates an AST', () => {
    expect(Lexer(Tokeniser(`main x y => { "text" }`))).toEqual({
      type: 'Program',
      body: [
        {
          type: 'Function',
          name: 'main',
          params: [
            {
              type: 'Identifier',
              name: 'x'
            },
            {
              type: 'Identifier',
              name: 'y'
            }
          ],
          body: [
            {
              type: 'StringLiteral',
              value: 'text'
            }
          ]
        }
      ]
    })
  })
  test('parseFunction', () => {
    expect(
      parseFunction(0, [
        { type: 'identifier', value: 'main' },
        { type: 'identifier', value: 'x' },
        { type: 'identifier', value: 'y' },
        { type: 'special', value: '=>' },
        { type: 'special', value: '{' },
        { type: 'number', value: '1' },
        { type: 'string', value: 'text' },
        { type: 'special', value: '}' }
      ])[1]
    ).toEqual({
      body: [
        { type: 'NumberLiteral', value: '1' },
        { type: 'StringLiteral', value: 'text' }
      ],
      name: 'main',
      params: [
        { name: 'x', type: 'Identifier' },
        { name: 'y', type: 'Identifier' }
      ],
      type: 'Function'
    })
  })
})
