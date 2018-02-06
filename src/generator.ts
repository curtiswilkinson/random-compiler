import { AST, Node } from './Lexer'
const generator = (node: Node): string => {
  if (node.type === 'Program') {
    return node.body.map(generator).join('\n')
  }

  if (node.type === 'Function') {
    const returnValue = node.body[node.body.length - 1]
    node.body.pop()
    return `function ${node.name}(${node.params.map(generator).join(', ')}) {
  ${node.body.map(generator)}
  return ${generator(returnValue)}
}`
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

  if (node.type === 'Expression') {
    return generator(node.left) + node.operator + generator(node.right)
  }

  if (node.type === 'Variable') {
    const body = generator(node.body)
    return `var ${node.identifier.name} = ${body}`
  }

  throw new Error('Unhandled node type')
}

export default generator
