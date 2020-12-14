const fs = require('fs')
const path = require('path')
const readline = require('readline')

const unified = require('unified')
const markdown = require('remark-parse')
const transformer = require('./transformer')
const retextStringify = require('retext-stringify')

const { src, dist } = require('./config')

fs.readdir(path.resolve(__dirname, src), (err, files) => {
  files = [files[0]]
  files.forEach(compileFile)
})

function compileFile(file) {
  const dataPath = path.resolve(__dirname, `${src}/${file}`)

  const rl = readline.createInterface({
    input: fs.createReadStream(dataPath),
  });

  let input = ''
  let desc = ''
  let content = ''
  let lineType = 0
  rl.on('line', (line) => {
    if (line.indexOf('#') === 0 && line.indexOf('##') !== 0) {
      input += line + '\n'
      lineType = 1

      return
    }

    if (line.indexOf('##') === 0) {
      lineType = 2
    }

    switch (lineType) {
      case 1:
        desc += line + '\n'
        break;
      case 2:
        content += line + '\n'
        break
      default:
        return
    }
  });

  rl.on('close', () => {
    compile({
      name: file,
      content: input
    }, (output) => {
      if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist)
      }

      fs.writeFileSync(path.resolve(__dirname, `${dist}/${file}`), `${output}${desc}<!--more-->\n\n${content}`, { encoding: 'utf-8' })
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
      if(err){
        console.log(err)
      }
      
      cb && cb(file)
    })
}
