import Tokeniser from '../tokeniser'

describe('Tokeniser', () => {
  test('it tokenises a sum', () => {
    expect(Tokeniser('sum x y => {' + '\n\t' + 'x + y' + '\n' + '}')).toEqual([
      { type: 'identifier', value: 'sum' },
      { type: 'identifier', value: 'x' },
      { type: 'identifier', value: 'y' },
      { type: 'special', value: '=>' },
      { type: 'special', value: '{' },
      { type: 'whitespace', value: 'INDENT' },
      { type: 'identifier', value: 'x' },
      { type: 'operator', value: '+' },
      { type: 'identifier', value: 'y' },
      { type: 'whitespace', value: 'DEDENT' },
      { type: 'special', value: '}' }
    ])
  })
  test('it tokenises a variable', () => {
    expect(Tokeniser(`x = 1 + 3`)).toEqual([
      { type: 'identifier', value: 'x' },
      { type: 'operator', value: '=' },
      { type: 'number', value: '1' },
      { type: 'operator', value: '+' },
      { type: 'number', value: '3' }
    ])
  })

  test('it tokenises operators', () => {
    expect(Tokeniser(`==+-/*=%++`)).toEqual([
      { type: 'operator', value: '==' },
      { type: 'operator', value: '+' },
      { type: 'operator', value: '-' },
      { type: 'operator', value: '/' },
      { type: 'operator', value: '*' },
      { type: 'operator', value: '=' },
      { type: 'operator', value: '%' },
      { type: 'operator', value: '++' }
    ])
  })
  test('it tokenises strings', () => {
    expect(Tokeniser(`x = "test"`)).toEqual([
      { type: 'identifier', value: 'x' },
      { type: 'operator', value: '=' },
      { type: 'string', value: 'test' }
    ])
  })

  test('it tokenises keywords', () => {
    expect(Tokeniser(`case x of`)).toEqual([
      { type: 'keyword', value: 'case' },
      { type: 'identifier', value: 'x' },
      { type: 'keyword', value: 'of' }
    ])
    expect(Tokeniser(`Number -> String`)).toEqual([
      { type: 'keyword', value: 'Number' },
      { type: 'special', value: '->' },
      { type: 'keyword', value: 'String' }
    ])
  })

  test('unknown charactors throw', () => {
    expect(() => Tokeniser('#')).toThrowError()
  })
})
