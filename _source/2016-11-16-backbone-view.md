# Backbone解析（3）：视图

Backbone.View的代码非常精简。除了初始化DOM和事件绑定之外，基本没有帮我们做任何事情。（DOM结构还是我们自己写的）

## 事件处理
### 快捷绑定
Backbone.View提供了快捷的事件绑定方法，只需在初始化时定义events参数：
```js
events: {
   'click .nav': 'go',
   'blur input':'back'
}
```
### 如何实现？
原理很简单，内部初始化DOM的时候，遍历events对象，提取出事件名、选择器、处理函数，然后绑定。
事件全部绑定为当前view命名空间的事件，方便后续移除。
```js
// 格式参照jQuery的event.namespace
this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
```

## $方法
这是一个很有设计感的接口，虽然只有一行代码。
```js
$: function(selector) {
   return this.$el.find(selector);
}
```
一般来说，每个视图只能操作属于自己的DOM元素。需要操作其他元素时，需要调用其他视图暴露的接口。

在当前视图选择元素，既限制了上下文，又优化了性能。

