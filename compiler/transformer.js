module.exports = document

const DATE_REG = /^(\d{4}[\/-]\d{2}[\/-]\d{2})/
const DEFAULT_DATE = '2046-09-29'


function document({ name = '' }) {
  const matched = name.match(DATE_REG)
  const matchedDate = (matched && matched[1]) ? matched[1] : DEFAULT_DATE

  let meetFirstSubHeading = false

  return transformer

  function transformer(tree) {
    const result = {
      type: 'root',
      children: [],
      position: tree.position,
    }

    let current = 0;
    let node = null;

    while (current < tree.children.length) {
      node = tree.children[current]

      if (node.type === 'heading' && node.depth === 1) {
        node = {
          type: 'paragraph',
          children: [{
            type: 'text',
            value: `---\ntitle: ${node.children[0].value}\ndate: ${matchedDate}\n---\n`
          }]
        }
      }

      if (node.type === 'paragraph' && node.children && node.children.find(item => item.type === 'image')) {
        node.children = node.children.map(item => {
          if (item.type === 'image') {
            if (item.url.indexOf('../') > -1) {
              item.url = item.url.replace('\.\.\/', '/blog\/')
            }
          }
          return item
        })
      }

      if (node.type === 'heading' && node.depth === 2) {
        if (!meetFirstSubHeading) {
          result.children.push({
            type: 'paragraph',
            children: [{
              type: 'html',
              value: `<!--more-->`
            }]
          })

          meetFirstSubHeading = true
        }
      }

      result.children.push(node)

      current++
    }

    return result
  }
}
