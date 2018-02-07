import * as fs from 'fs'

import Tokeniser from './tokeniser'
import Lexer from './lexer'
import Generator from './generator'

fs.readFile('main', 'utf8', (err, data) => {
  const tokens = Tokeniser(data)
  fs.writeFileSync(
    'token',
    tokens.map(x => JSON.stringify(x, null, 2)).join('\n')
  )
  const AST = Lexer(tokens)
  fs.writeFileSync('AST', JSON.stringify(AST, null, 2))
  const js = Generator(AST)
  fs.writeFileSync('main.js', js)
})
