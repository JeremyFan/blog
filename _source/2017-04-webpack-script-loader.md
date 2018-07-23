# webpack一种打包非模块化公共库思路

有一个项目用到了一些老旧的需要直接在页面中引入加载运行的库。

作为 webpack 初学者，分享一种简单的处理思路。

因为发现了 `script-loader` 这个loader。

文档中的说明很简单：

> Executes JS script once in global context.

这不就相当于在页面中引入吗？我觉得对于之前直接页面中引入、预先加载的基础库，使用这个 loader 很合适。

所以对于项目依赖的公共库整体处理如下：

1. entry 中 设置一个 vendor 入口，配置好公共库。venfor 中各种各样的模块化规范，比如非模块化的脚本`a.js`， UMD 风格的 `b.js`，CommonJS 风格的 `c.js`
```js
vendor: [
    'libs/a',
    'libs/b',
    'c'
]
```

2. 增加一条 module.rule，匹配老旧的公共库，使用`script-loader`加载。为了方便，我把这些代码统一放在了 libs 文件夹下。
```js
{
  test: /libs.*\.js$/,
  use: 'script-loader'
},
```

3. 因为公共库代码几乎没有改动，所以使用`webpack.optimize.CommonsChunkPlugin` 提取公共库代码单独打包，方便缓存。
```js
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor'
})
```

参考资料：
- [webpack document script-loader](https://webpack.js.org/loaders/script-loader/)


