import Tokeniser from '../tokeniser'
import Lexer, { parseFunction } from '../lexer'

describe.only('Lexec', () => {
  test('it generates an AST', () => {
    expect(
      Lexer(Tokeniser(`test = 1 + 1 - "test"\nmain x y => { \n\t"text"\n}`))
    ).toEqual({
      type: 'Program',
      body: [
        {
          type: 'Variable',
          identifier: { name: 'test', type: 'Identifier' },
          body: {
            type: 'BinaryExpression',
            left: { type: 'NumberLiteral', value: '1' },
            operator: '+',
            right: {
              type: 'BinaryExpression',
              left: { type: 'NumberLiteral', value: '1' },
              operator: '-',
              right: { type: 'StringLiteral', value: 'test' }
            }
          }
        },
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

  test('it parses a function definition and invocation', () => {
    // expect(
    //   Lexer([
    //     { type: 'identifier', value: 'main' },
    //     { type: 'identifier', value: 'x' },
    //     { type: 'special', value: '=>' },
    //     { type: 'special', value: '{' },
    //     { type: 'whitespace', value: 'INDENT' },
    //     { type: 'identifier', value: 'x' },
    //     { type: 'operator', value: '+' },
    //     { type: 'identifier', value: 'y' },
    //     { type: 'whitespace', value: 'DEDENT' },
    //     { type: 'special', value: '}' },
    //     { type: 'identifier', value: 'main' },
    //     { type: 'number', value: '1' }
    //   ])
    // ).toEqual({})
  })
})
