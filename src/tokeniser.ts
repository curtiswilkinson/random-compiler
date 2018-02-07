type TokenType =
  | 'special'
  | 'number'
  | 'string'
  | 'identifier'
  | 'operator'
  | 'keyword'

export interface Token {
  type: TokenType
  value: string
}

const keywords = ['this', 'case', 'of']

export default (input: string) => tokenise(0, input + '\n', [])

const tokenise = (current: number, input: string, tokens: Token[]): Token[] => {
  const lookBehind = () => input[current + 1]
  const lookAhead = () => input[current + 1]
  const next = () => (char = input[++current])

  if (current === input.length) {
    return tokens
  }

  let char = input[current]

  // WHITESPACE
  if (/\s/.test(char)) {
    return tokenise(current + 1, input, tokens)
  }

  // SPECIAL
  if (/[()[\]{}]/g.test(char)) {
    return tokenise(current + 1, input, [
      ...tokens,
      { type: 'special', value: char }
    ])
  }

  // NUMBERS
  if (/[0-9]/.test(char)) {
    let number = ''
    while (/[0-9]/.test(char)) {
      number += char
      next()
    }

    return tokenise(current, input, [
      ...tokens,
      { type: 'number', value: number }
    ])
  }

  // STRING
  if (char === `"`) {
    let string = ''

    next()

    while (char !== '"') {
      string += char
      next()
    }

    next()

    return tokenise(current + 1, input, [
      ...tokens,
      { type: 'string', value: string }
    ])
  }

  // OPERATOR
  if (char === '=') {
    // special case for arrows

    if (lookAhead() === '>') {
      return tokenise(current + 2, input, [
        ...tokens,
        { type: 'special', value: '=>' }
      ])
    }

    const isDouble = lookAhead() === '='
    return tokenise(current + (isDouble ? 2 : 1), input, [
      ...tokens,
      { type: 'operator', value: isDouble ? '==' : '=' }
    ])
  }
  if (char === '+') {
    return tokenise(current + 1, input, [
      ...tokens,
      { type: 'operator', value: '+' }
    ])
  }
  if (char === '-') {
    return tokenise(current + 1, input, [
      ...tokens,
      { type: 'operator', value: '-' }
    ])
  }
  if (char === '%') {
    return tokenise(current + 1, input, [
      ...tokens,
      { type: 'operator', value: '%' }
    ])
  }
  if (char === '*') {
    return tokenise(current + 1, input, [
      ...tokens,
      { type: 'operator', value: '*' }
    ])
  }
  if (char === '/') {
    return tokenise(current + 1, input, [
      ...tokens,
      { type: 'operator', value: '/' }
    ])
  }

  // IDENTIFIER
  if (/[a-z]/i.test(char)) {
    let name = ''
    while (/[a-z]/i.test(char)) {
      name += char
      next()
    }

    if (keywords.includes(name)) {
      return tokenise(current, input, [
        ...tokens,
        { type: 'keyword', value: name }
      ])
    }

    return tokenise(current, input, [
      ...tokens,
      { type: 'identifier', value: name }
    ])
  }

  throw new TypeError('Unknown character: ' + char)
}
