import * as fs from 'mz/fs'
import * as path from 'path'
const glob = require('glob-fs')()

import Tokeniser from './tokeniser'
import Lexer from './lexer'
import Generator from './generator'

interface Config {
  source: string
}

const compile = (sourcePath: string) =>
  fs.readFile(sourcePath, 'utf8').then(sourceCode => {
    const output = Generator(Lexer(Tokeniser(sourceCode)))
    const name = path.parse(sourcePath).name
    const writePath = path.join(path.dirname(sourcePath), name + '.ard.js')

    return fs.writeFile(writePath, output)
  })

const main = async () => {
  const config = JSON.parse(await fs.readFile('ardent.json', 'utf8'))
  const sourceFiles = glob.readdirSync(path.join(config.source + '/**/*.ard'))

  return await Promise.all(sourceFiles.map(compile))
}

main()
