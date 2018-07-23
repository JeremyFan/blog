title: Babel IE8 兼容性处理
date: 2017/4/25
---

使用 babel 把 ES6 代码转成 ES5 代码后，在 IE8 会遇到哪些兼容性问题呢。如何解决？

<!-- more -->

## 关键字作为属性名
由于使用 ES6 的模块化规范，我们经常使用这样的代码定义导出模块：

```js
export default class Volumer { ... }
```

经过 babel 处理成 ES5 后，
模块本身的导出代码变为：
```js
exports.default = Volumer;
```
并生成了引入模块的函数：
```js
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
```

这里 default 作为关键字直接用作对象的属性名，ie8是不支持的。
```js
>>var foo = { default: 1 }
// "缺少标识符、字符串或数字"

>>foo.default
// "缺少标识符"
```

需要改成另一种写法：
```js
>>var foo = { 'default': 1 }
>>foo['default']
// 1
```

### 解决方法
babel 提供了两个插件专门解决关键字作为对象属性的定义和这个问题：
- [ES3 property literals transform](http://babeljs.io/docs/plugins/transform-es3-property-literals/)
- [ES3 member expressions literals transform](http://babeljs.io/docs/plugins/transform-es3-member-expression-literals/)

配置好这两个插件再次打包，代码就会被处理成：
```js
exports['default'] = Volumer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
```
在 ie8 下也可以正常运行。

## Object.defineProperty()
babel 使用 Object.defineProperty 定义了一个属性来标记是否是 ES6 模块
```js
Object.defineProperty(exports, "__esModule", {
    value: true
});
```
但`Object.defineProperty()`是一个 ES5 增加的方法，ie8 并不支持使用这个方法为**原生对象**定义属性。

关于 ie8 的这个特殊行为可以参考 MDN 文档：[Object.defineProperty()#Internet Explorer 8 specific notes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Internet_Explorer_8_specific_notes)

简而言之：
- 仅支持使用此方法为 dom 对象定义属性
- 描述符并不能随意设置，而是特定的值
- 想要重新设置属性必须先删除属性


知乎上也有一些有趣的讨论：
- [能让 Vue 像 Avalon 那样兼容 IE8 吗？](https://www.zhihu.com/question/50490125) 
- [JavaScript 如何完整实现Object watch 对象观察者？](https://www.zhihu.com/question/47924271)

从上面的问题可以看出实现一个`Object.defineProperty()`方法的 polyfill 是非常有难度的。我本身对此探索的也不多，所以选择了一种简单的处理方法。

### 解决方法
babel 使用 loose 模式转换 ES6 代码。

关于 loose 模式和 normal 模式的区别可以看这篇文章：[Babel 6: loose mode](http://2ality.com/2015/12/babel6-loose-mode.html)

简而言之，normal 模式的代码更靠近 ES6，而 loose 模式的代码更具兼容性。

使用 loose 模式后，可以看到转换后的代码变成了：
```js
exports.__esModule = true;
```

也就没有问题了。