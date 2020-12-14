module.exports = document

const DATE_REG = /^(\d{4}[\/-]\d{2}[\/-]\d{2})/
const DEFAULT_DATE = '2046-09-29'


function document({ date = '' }) {
  const matched = date.match(DATE_REG)

  const matchedDate = (matched && matched[1]) ? matched[1] : DEFAULT_DATE

  return transformer

  function transformer(tree, file) {
    if (tree.type === 'root') {
      tree.children = tree.children.map((item, index) => {
        if (item.type === 'heading' && item.depth === 1) {
          
          return {
            type: 'paragraph',
            children: [{
              type: 'text',
              value: `---\ntitle: ${item.children[0].value}\ndate: ${matchedDate}\n---\n`
            }]
          }
        }

        return item
      })

      return tree
    }
  }
}
