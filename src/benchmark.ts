import * as Benchmark from 'benchmark'
import Tokeniser from './tokeniser'
import Lexer from './lexer'
import Generator from './generator'

const suit = new Benchmark.Suite()

suit
  .add('Tokeniser', () => {
    Tokeniser(
      `test = 1 + 1 - "test"\nmain x y => { \n\t"text"++"whatever"\n}\nmain 1 2`
    )
  })
  .add('Lexer', () => {
    Lexer([
      { type: 'identifier', value: 'test' },
      { type: 'operator', value: '=' },
      { type: 'number', value: '1' },
      { type: 'operator', value: '+' },
      { type: 'number', value: '1' },
      { type: 'operator', value: '-' },
      { type: 'string', value: 'test' },
      { type: 'whitespace', value: 'SAMEDENT' }
    ])
  })
  .add('Generator', () => {
    Generator({
      type: 'Program',
      body: [
        {
          type: 'Variable',
          identifier: { type: 'Identifier', name: 'test' },
          body: {
            type: 'BinaryExpression',
            operator: '+',
            left: { type: 'NumberLiteral', value: '1' },
            right: {
              type: 'BinaryExpression',
              operator: '-',
              left: { type: 'NumberLiteral', value: '1' },
              right: { type: 'StringLiteral', value: 'test' }
            }
          }
        },
        {
          type: 'Function',
          name: 'main',
          params: [
            { type: 'Identifier', name: 'x' },
            { type: 'Identifier', name: 'y' }
          ],
          body: [
            {
              type: 'BinaryExpression',
              operator: '+',
              left: { type: 'StringLiteral', value: 'text' },
              right: { type: 'StringLiteral', value: 'whatever' }
            }
          ]
        },
        {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'main' },
          args: [
            { type: 'NumberLiteral', value: '1' },
            { type: 'NumberLiteral', value: '2' }
          ]
        }
      ]
    })
  })
  .on('cycle', (event: any) => {
    console.log(String(event.target))
  })
  .run()
