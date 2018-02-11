import { AST, Node, FunctionNode, CallExpressionNode } from './Lexer'

const generateFunction = (node: FunctionNode) => {
  const lastExpression = node.body[node.body.length - 1]
  node.body.pop()

  let string =
    'const ' +
    node.name +
    ' = ' +
    node.params.map(generator).join(' => ') +
    ' => {\n'

  if (node.body.length) {
    string += '\t' + node.body.map(generator).join('\n') + '\n'
  }

  string += '\treturn ' + generator(lastExpression) + '\n}'

  return string
}

const parseOperator = (operator: string): string => {
  if (operator === '++') {
    return '+'
  }

  return operator
}

const generateCallExpression = (node: CallExpressionNode) => {
  return (
    node.callee.name +
    node.args
      .map(generator)
      .map(x => '(' + x + ')')
      .join('')
  )
}

const generator = (node: Node): string => {
  if (node.type === 'Program') {
    return node.body.map(generator).join('\n')
  }

  if (node.type === 'Function') {
    return generateFunction(node)
  }

  if (node.type === 'Identifier') {
    return node.name
  }

  if (node.type === 'StringLiteral') {
    return '"' + node.value + '"'
  }

  if (node.type === 'NumberLiteral') {
    return node.value
  }

  if (node.type === 'BinaryExpression') {
    return (
      generator(node.left) +
      ' ' +
      parseOperator(node.operator) +
      ' ' +
      generator(node.right)
    )
  }

  if (node.type === 'CallExpression') {
    return generateCallExpression(node)
  }

  if (node.type === 'Variable') {
    const body = generator(node.body)
    return `var ${node.identifier.name} = ${body}`
  }

  throw new Error('Unhandled node type')
}

export default generator
