const path = require('path')
import buble from '@rollup/plugin-buble'
import commonjs from '@rollup/plugin-commonjs'
import node from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const pkg = require('../package.json')
const moduleName = pkg.name
const version = process.env.VERSION || pkg.version
const external = Object.keys(pkg.dependencies)
const entry = 'src/index.ts'
const resolve = (dir) => path.resolve(__dirname, '../', dir)

const banner =
  '/**\n' +
  ` * ${moduleName} v${version}\n` +
  ` * (c) 2021-${new Date().getFullYear()} 君惜\n` +
  ' * Released under the ISC License.\n' +
  ' */'

function simplifyTypescript(declaration = false) {
  return typescript({
    exclude: 'node_modules/**',
    typescript: require('typescript'),
    tsconfigOverride: {
      compilerOptions: {
        module: 'esnext',
        declaration: declaration
        // declarationDir: './dist/types',
      }
    },
    useTsconfigDeclarationDir: true
  })
}

// gen config template
function gen(options) {
  return {
    ...options,
    entry: resolve(options.entry),
    dest: resolve(options.dest),
    format: options.format,
    env: options.env,
    plugins: [node(), commonjs(), json()].concat(options.plugins || []),
    external,
    banner
  }
}

function gencjs(entry, dest) {
  // return gen({entry, dest, format: 'cjs', env: 'production', exports: 'default'})
  return gen({
    entry,
    dest,
    format: 'cjs',
    env: 'production',
    plugins: [simplifyTypescript(true)]
  })
}

function genes(entry, dest) {
  return gen({
    entry,
    dest,
    format: 'es',
    env: 'production',
    plugins: [simplifyTypescript()]
  })
}

function genumd(entry, dest) {
  return gen({
    entry,
    dest,
    format: 'umd',
    env: 'production',
    plugins: [
      babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
      terser(),
      simplifyTypescript()
    ],
    sourcemap: true
  })
}

const builds = {
  cjs: gencjs(entry, `dist/${moduleName}.cjs.js`),
  es: genes(entry, `dist/${moduleName}.es.js`),
  umd: genumd(entry, `dist/${moduleName}.min.js`)
}

function genConfig(format) {
  const opts = builds[format]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      exports: opts.exports ? opts.exports : 'auto',
      banner: opts.banner,
      name: opts.moduleName || moduleName
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  const vars = {}

  if (opts.env) {
    vars['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(replace(vars))

  if (opts.transpile !== false) {
    config.plugins.push(
      buble({
        objectAssign: 'Object.assign',
        transforms: {
          arrow: true,
          dangerousForOf: true,
          asyncAwait: false,
          generator: false
        }
      })
    )
  }

  Object.defineProperty(config, '_format', {
    enumerable: false,
    value: opts.format
  })

  return config
}

const format = process.env.FORMAT || 'cjs'

export default genConfig(format)
