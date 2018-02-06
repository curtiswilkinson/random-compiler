import Tokeniser from '../tokeniser'

describe('Tokeniser', () => {
  test('it handles identifiers', () => {
    expect(Tokeniser(`One Two`)).toEqual([
      { type: 'identifier', value: 'One' },
      { type: 'identifier', value: 'Two' }
    ])
  })

  test('it handles strings', () => {
    expect(Tokeniser(`"One" "Two"`)).toEqual([
      { type: 'string', value: 'One' },
      { type: 'string', value: 'Two' }
    ])
  })

  test('it handles operators', () => {
    expect(Tokeniser(`=+/%-`)).toEqual([
      { type: 'operator', value: '=' },
      { type: 'operator', value: '+' },
      { type: 'operator', value: '/' },
      { type: 'operator', value: '%' },
      { type: 'operator', value: '-' }
    ])
  })

  test('it handles special', () => {
    expect(Tokeniser(`)({}=>`)).toEqual([
      { type: 'special', value: ')' },
      { type: 'special', value: '(' },
      { type: 'special', value: '{' },
      { type: 'special', value: '}' },
      { type: 'special', value: '=>' }
    ])
  })

  test('it handles numbers', () => {
    expect(Tokeniser(`123 456`)).toEqual([
      { type: 'number', value: '123' },
      { type: 'number', value: '456' }
    ])
  })

  test('it handles keywords', () => {
    expect(Tokeniser(`case x of {`)).toEqual([
      { type: 'keyword', value: 'case' },
      { type: 'identifier', value: 'x' },
      { type: 'keyword', value: 'of' },
      { type: 'special', value: '{' }
    ])
  })

  test('it handles multiple types simultenously', () => {
    expect(Tokeniser(`test(1+1) = 2`)).toEqual([
      { type: 'identifier', value: 'test' },
      { type: 'special', value: '(' },
      { type: 'number', value: '1' },
      { type: 'operator', value: '+' },
      { type: 'number', value: '1' },
      { type: 'special', value: ')' },
      { type: 'operator', value: '=' },
      { type: 'number', value: '2' }
    ])
  })

  test('it throws at something unexpected', () => {
    expect(() => Tokeniser(`@`)).toThrowError()
  })
})
