const fs = require('fs')
const path = require('path')
const readline = require('readline')

const unified = require('unified')
const markdown = require('remark-parse')
const transformer = require('./transformer')
const retextStringify = require('retext-stringify')

const { src, dist } = require('./config')

fs.readdir(path.resolve(__dirname, src), (err, files) => {
  files.forEach(compileFile)
})

function compileFile(file) {
  const dataPath = path.resolve(__dirname, `${src}/${file}`)

  const rl = readline.createInterface({
    input: fs.createReadStream(dataPath),
  });

  let input = ''
  let restTexts = ''
  let needTransform = true

  rl.on('line', (line) => {
    if (line.indexOf('##') === 0) {
      needTransform = false
    }

    if (needTransform) {
      input += line + '\n'
    } else {
      restTexts += line + '\n'
    }
  });

  rl.on('close', () => {
    compile({
      name: '2020-12-14-github-actions',
      content: input
    }, (output) => {
      if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist)
      }

      fs.writeFileSync(path.resolve(__dirname, `${dist}/2020-12-14-github-actions.md`), `${output}\n\n<!--more-->\n\n${restTexts}`, { encoding: 'utf-8' })
    })
  })
}

function compile(file, cb) {
  const { name, content } = file

  unified()
    .use(markdown)
    .use(transformer, { date: name })
    .use(retextStringify)
    .process(content, function (err, file) {
      cb && cb(file)
    })
}
