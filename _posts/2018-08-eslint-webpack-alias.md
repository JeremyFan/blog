---
title: 关于eslint-plugin-import无法识别webpack alias问题
date: 2018/08/23
---


有时为了方便引入模块，我们会配置 alias，比如：
```js
resolve: {
  extensions: ['.js', '.jsx', '.json'],
  alias: {
    components: path.join(ROOT_PATH, 'src/components'),
  }
},
```
然后引入模块的时候就可以：
```js
import Layout from 'components/Layout';
```

但 eslint-plugin-import 默认是无法识别 webpack 配置的 alias 的，所以可能会有错误提示，比较常见的是这两条规则：import/no-unresolved与import/extensions。

<!-- more -->

[eslint] Unable to resolve path to module 'components/Layout'. (import/no-unresolved)
[eslint] Missing file extension for "components/Layout" (import/extensions)

import/no-unresolved 报错是因为解析路径无法识别 alias，相当于在当前路径下找 components/Layout；
import/extensions 报错我理解是因为无法解析到文件，所以识别不出文件扩展名是什么，无法判断是不是.js、.jsx文件，只能提示缺少扩展名了。

当然我们可以不使用 alias，
或是禁掉 eslint 规则，import/no-unresolved 也提供了 ignore 配置，可以忽略一些不用检测包，我们可以把 components 忽略掉：
```js
"import/no-unresolved": [
  "error",
  {
    "ignore": ['components/']
  }
]
```
但无论是 eslint 还是 alias，都是好的东西。都应该被保留。
所以这个问题的关键就是让 eslint 解析模块的时候可以应用 webpack 的 alias 配置。
当然遇到这个问题的人应该比较多，解决方案也比较现成。那就是[eslint-import-resolver-webpack](https://www.npmjs.com/package/eslint-import-resolver-webpack )这个插件。

安装：
```js
npm i eslint-import-resolver-webpack -D
```

然后在.eslintrc.js中配置一下import/resolver，config配到webpack配置alias的配置文件
```js
"settings": {
  "import/resolver": {
    "webpack":{
      "config": "build-script/webpack.base.js"
    }
  }
},
```

关于这个解决方案，看 [eslint-plugin-import 文档中关于 Resolvers](https://www.npmjs.com/package/eslint-plugin-import#resolvers ) 的部分就了解了。
eslint 默认使用的是 node 的解析规则（[browserify/resolve](https://www.npmjs.com/package/resolve ) ），但前端很多项目都用上了 webpack，webpack 有自己的一套规则，和 node 不完全相同，包括配置文件中的 alias 等。所以 eslint 提供了`import/resolver`配置，可以使用其他 resolver 来解决这个问题。