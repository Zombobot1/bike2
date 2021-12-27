import bash from 'refractor/lang/bash'
import c from 'refractor/lang/c'
import cpp from 'refractor/lang/cpp'
import sharp from 'refractor/lang/csharp'
import fsharp from 'refractor/lang/fsharp'
import css from 'refractor/lang/css'
import dart from 'refractor/lang/dart'
import docker from 'refractor/lang/docker'
import elixir from 'refractor/lang/elixir'
import go from 'refractor/lang/go'
import graphql from 'refractor/lang/graphql'
import haskell from 'refractor/lang/haskell'
import html from 'refractor/lang/markup'
import java from 'refractor/lang/java'
import jsx from 'refractor/lang/jsx'
import json from 'refractor/lang/json'
import kotlin from 'refractor/lang/kotlin'
import less from 'refractor/lang/less'
import php from 'refractor/lang/php'
import powershell from 'refractor/lang/powershell'
import python from 'refractor/lang/python'
import rust from 'refractor/lang/rust'
import sass from 'refractor/lang/sass'
import scala from 'refractor/lang/scala'
import swift from 'refractor/lang/swift'
import shell from 'refractor/lang/bash'
import sql from 'refractor/lang/sql'
import tsx from 'refractor/lang/tsx'
import yaml from 'refractor/lang/yaml'
import latex from 'refractor/lang/latex'
import ruby from 'refractor/lang/ruby'
import { refractor } from 'refractor/lib/core.js'
import { str } from '../../../utils/types'
import { toHtml } from 'hast-util-to-html'

refractor.register(ruby)
refractor.register(latex)
refractor.register(bash)
refractor.register(c)
refractor.register(cpp)
refractor.register(sharp)
refractor.register(fsharp)
refractor.register(css)
refractor.register(dart)
refractor.register(docker)
refractor.register(elixir)
refractor.register(go)
refractor.register(graphql)
refractor.register(haskell)
refractor.register(html)
refractor.register(java)
refractor.register(jsx)
refractor.register(json)
refractor.register(kotlin)
refractor.register(less)
refractor.register(php)
refractor.register(powershell)
refractor.register(python)
refractor.register(rust)
refractor.register(sass)
refractor.register(scala)
refractor.register(swift)
refractor.register(shell)
refractor.register(sql)
refractor.register(tsx)
refractor.register(yaml)

refractor.alias({ jsx: ['javascript'], tsx: ['typescript'], fsharp: ['f#'], sharp: ['c#'], cpp: ['c++'] }) // jsx extends the javascript module

export const programmingLanguages = [
  'Text',
  'Bash',
  'C',
  'C++',
  'C#',
  'F#',
  'CSS',
  'Dart',
  'Docker',
  'Elexir',
  'Go',
  'GraphQL',
  'Haskell',
  'HTML',
  'Java',
  'JavaScript',
  'JSON',
  'Kotlin',
  'Less',
  'PHP',
  'PowerShell',
  'Python',
  'Rust',
  'Sass',
  'Scala',
  'Swift',
  'Shell',
  'SQL',
  'TypeScript',
  'YAML',
  'LaTeX',
  'Ruby',
]

export const highlight = (code: str, language: str): str => {
  return toHtml(refractor.highlight(code, language.toLowerCase()))
}
