const fs = require('fs')
const path = require('path')

const unified = require('unified')
const markdown = require('remark-parse')
const remarkStringify = require('remark-stringify')
const transformer = require('./transformer')

const { src, dist } = require('./config')

fs.readdir(path.resolve(__dirname, src), (err, files) => {
  files.forEach(compileFile)
})

function compileFile(file) {
  const dataPath = path.resolve(__dirname, `${src}/${file}`)

  const input = fs.readFileSync(dataPath, { encoding: 'utf-8' })

  compile({
    name: file,
    content: input
  }, (output) => {
    if (!fs.existsSync(dist)) {
      fs.mkdirSync(dist, { recursive: true })
    }

    fs.writeFileSync(path.resolve(__dirname, `${dist}/${file}`), output, { encoding: 'utf-8' })
  })
}

function compile(file, cb) {
  const { name, content } = file

  unified()
    .use(markdown)
    .use(transformer, { name })
    .use(remarkStringify, {
      listItemIndent: 'one',
    })
    .process(content, function (err, result) {
      if (err) {
        console.log(err)
      }

      // output有很多\，手动去掉
      cb && cb(unescapeBackslash(result.contents))
    })
}

function unescapeBackslash(input) {
  const REGs = [
    /\\(\*)/g,
    /\\(\[)/g,
    /\\(\-)/g,
    /\\(\_)/g,
  ]

  return REGs.reduce((str, reg) => {
    return str.replace(reg, '$1')
  }, input)
}