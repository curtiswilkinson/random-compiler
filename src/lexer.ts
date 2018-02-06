import { Token } from './tokeniser'

interface StringNode {
  type: 'StringLiteral'
  value: string
}

interface NumberNode {
  type: 'NumberLiteral'
  value: string
}

interface ExpressionNode {
  type: 'Expression'
  operator: string
  left: Node
  right: Node
}

interface FunctionNode {
  type: 'Function'
  name: string
  params: IdentifierNode[]
  body: Node[]
}

interface VariableNode {
  type: 'Variable'
  identifier: IdentifierNode
  body: Node
}

interface IdentifierNode {
  type: 'Identifier'
  name: string
}

interface CallNode {
  type: 'CallExpression'
  callee: IdentifierNode
  args: IdentifierNode[]
}

interface ProgramNode {
  type: 'Program'
  body: Node[]
}

export type Node =
  | StringNode
  | NumberNode
  | ExpressionNode
  | CallNode
  | FunctionNode
  | IdentifierNode
  | ProgramNode
  | VariableNode

export interface AST {
  type: 'Program'
  body: Node[]
}

export default (tokens: Token[]) => {
  let ast: AST = {
    type: 'Program',
    body: []
  }

  let current = 0
  let node = undefined
  while (current < tokens.length) {
    ;[current, node] = parseToken(current, tokens)
    if (node) {
      ast.body.push(node)
    }
  }

  return ast
}

export const parseFunction = (
  current: number,
  tokens: Token[]
): [number, Node] => {
  let token = tokens[current++]
  let node: FunctionNode = {
    type: 'Function',
    name: token.value,
    params: [],
    body: []
  }

  let param = undefined
  token = tokens[current++]

  while (token.type === 'identifier') {
    node.params.push({ type: 'Identifier', name: token.value })
    token = tokens[current++]
  }

  // HACK, this needs to be fixed pretty badly lol
  // Skip the => and {

  if (token.value !== '=>' || tokens[current].value !== '{') {
    throw new Error('Improper function syntax')
  }

  // Skipping
  token = tokens[++current]

  let bodyNode = undefined

  while (token.value !== '}') {
    ;[current, bodyNode] = parseToken(current, tokens)

    if (bodyNode) {
      node.body.push(bodyNode)
    }
    token = tokens[current]
  }

  return [current + 1, node]
}

const parseString = (current: number, tokens: Token[]): [number, Node] => [
  current + 1,
  {
    type: 'StringLiteral',
    value: tokens[current].value
  }
]

const parseNumber = (current: number, tokens: Token[]): [number, Node] => [
  current + 1,
  {
    type: 'NumberLiteral',
    value: tokens[current].value
  }
]

const parseExpression = (current: number, tokens: Token[]): [number, Node] => {
  const left = parseToken(current, tokens, true)[1]
  const operator = tokens[current + 1].value
  const right = parseToken(current + 2, tokens)[1]

  if (!left || !right) {
    throw new Error('Expression Error')
  }
  return [
    current + 3,
    {
      type: 'Expression',
      operator,
      left,
      right
    }
  ]
}

const parseIdentifier = (current: number, tokens: Token[]): [number, Node] => [
  current + 1,
  { type: 'Identifier', name: tokens[current].value }
]

const parseVariable = (current: number, tokens: Token[]): [number, Node] => {
  let identifier
  ;[current, identifier] = parseIdentifier(current, tokens)

  let body
  ;[current, body] = parseToken(current + 1, tokens)

  if (!body || !identifier) {
    console.log(body, identifier)
    throw new Error('Problem in variable declaration')
  }
  return [
    current,
    {
      type: 'Variable',
      identifier: identifier as IdentifierNode,
      body
    }
  ]
}

const parseToken = (
  current: number,
  tokens: Token[],
  skipNext: boolean = false // ew
): [number, Node | undefined] => {
  const token = tokens[current]
  const next = tokens[current + 1]

  if (!skipNext && next && next.type === 'operator' && next.value !== '=') {
    return parseExpression(current, tokens)
  }
  if (token.type === 'string') {
    return parseString(current, tokens)
  }
  if (token.type === 'number') {
    return parseNumber(current, tokens)
  }

  if (token.type === 'identifier') {
    if (next.type === 'identifier') {
      return parseFunction(current, tokens)
    }
    if (next.type === 'operator' && next.value === '=') {
      return parseVariable(current, tokens)
    }

    return parseIdentifier(current, tokens)
  }

  if (token.type === 'special' || token.type === 'operator') {
    return [current, undefined]
  }

  throw new Error('Fucked up' + JSON.stringify(token))
}
