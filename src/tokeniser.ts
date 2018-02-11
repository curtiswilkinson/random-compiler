type TokenType =
  | 'special'
  | 'number'
  | 'string'
  | 'identifier'
  | 'operator'
  | 'keyword'
  | 'whitespace'

export interface Token {
  type: TokenType
  value: string
}

const keywords = ['this', 'case', 'of', 'Number', 'String', 'Bool']

let indent = 0

export default (input: string) => {
  indent = 0
  return trampoline(tokenise)(0, input + '\n', [])
}

function trampoline(this: any, fn: any): any {
  return function(this: any) {
    let res = fn.apply(this, arguments)
    while (res instanceof Function) {
      res = res()
    }
    return res
  }
}

const tokenise = (
  current: number,
  input: string,
  tokens: Token[]
): Token[] | any => {
  const lookBehind = () => input[current + 1]
  const lookAhead = () => input[current + 1]
  const next = () => (char = input[++current])

  if (current === input.length) {
    return tokens
  }

  let char = input[current]

  // WHITESPACE
  if (char === '\n') {
    // Calculates the level of identation for the newline
    let newIndent = 0
    while (/\s/.test(char)) {
      if (char === '\n') {
        newIndent = 0
      } else {
        ++newIndent
      }
      next()
    }

    if (!lookAhead()) {
      return tokens
    }

    // Basically a signifier around:
    // a) Same indentation as before
    // b) More indented
    // c) Less indented
    let value = 'SAMEDENT'
    if (newIndent > indent) {
      value = 'INDENT'
    }

    if (newIndent < indent) {
      value = 'DEDENT'
    }

    indent = newIndent
    return () =>
      tokenise(current, input, [...tokens, { type: 'whitespace', value }])
  }

  // Skip over generalised whipespace
  if (/\s/.test(char)) {
    return () => tokenise(current + 1, input, tokens)
  }

  // SPECIAL
  if (char === ':') {
    // For the :: operator
    if (lookAhead() === ':') {
      return () =>
        tokenise(current + 2, input, [
          ...tokens,
          { type: 'special', value: '::' }
        ])
    }

    return () =>
      tokenise(current + 1, input, [
        ...tokens,
        { type: 'special', value: char }
      ])
  }

  if (/[()[\]{}]/g.test(char)) {
    return () =>
      tokenise(current + 1, input, [
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

    return () =>
      tokenise(current, input, [...tokens, { type: 'number', value: number }])
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

    return () =>
      tokenise(current + 1, input, [
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

    // Case for =(assignment) vs == (equivalence)
    const isDouble = lookAhead() === '='
    return () =>
      tokenise(current + (isDouble ? 2 : 1), input, [
        ...tokens,
        { type: 'operator', value: isDouble ? '==' : '=' }
      ])
  }

  if (char === '+') {
    // Special case for string concat ++
    if (lookAhead() === '+') {
      return () =>
        tokenise(current + 2, input, [
          ...tokens,
          {
            type: 'operator',
            value: '++'
          }
        ])
    }

    return () =>
      tokenise(current + 1, input, [
        ...tokens,
        { type: 'operator', value: '+' }
      ])
  }

  // Special case for skinny arrow
  if (char === '-') {
    if (lookAhead() === '>') {
      return () =>
        tokenise(current + 2, input, [
          ...tokens,
          { type: 'special', value: '->' }
        ])
    }

    return () =>
      tokenise(current + 1, input, [
        ...tokens,
        { type: 'operator', value: '-' }
      ])
  }

  if (char === '%') {
    return () =>
      tokenise(current + 1, input, [
        ...tokens,
        { type: 'operator', value: '%' }
      ])
  }

  if (char === '*') {
    return () =>
      tokenise(current + 1, input, [
        ...tokens,
        { type: 'operator', value: '*' }
      ])
  }

  if (char === '/') {
    return () =>
      tokenise(current + 1, input, [
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

    // keywords
    if (keywords.includes(name)) {
      return () =>
        tokenise(current, input, [...tokens, { type: 'keyword', value: name }])
    }

    return () =>
      tokenise(current, input, [...tokens, { type: 'identifier', value: name }])
  }

  throw new TypeError('Unknown character: ' + char)
}
