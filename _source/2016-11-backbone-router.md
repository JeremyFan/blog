# Backbone解析（4）：路由

Backbone路由的实现由 Backbone.Router 和 Backbone.History 两个模块完成。 

## 概述
#### 初始化（页面加载）

```flow
定义路由（表）-> 实例化路由 -> 启动监听URL

```

#### 程序运行中

```flow
URL改变 -> 匹配路由 -> 执行路由回调函数

```

## 定义路由（表）
常见这种形式的代码：
```
var Router = Backbone.Router.extend({
    routes: {
        "":"home",
        "song/:id": "song",
        "song/:id/detail": "detail",
    },
    home:function(){},
    song:function(id){},
    detail:function(){}
});
```
这一段代码定义了3个路由规则。当URL匹配时，分别会执行`home()`、`song()`、`detail()`3个函数。

## 实例化路由
```
var router = new Router;
```
实例化时，内部会调用`_bindRoutes()`方法绑定路由。
`_bindRoutes()`方法遍历路由表，循环调用`route()`方法绑定每个路由。
绑定前会把每个连路由规则转化成正则表达式，便于URL匹配。
`route()`方法调用`Backbone.history.route()`，最终路由绑定在`Backbone.history.handlers`这个属性上。

绑定完成后的handers属性：
 
## 启动监听
```
Backbone.history.start();
```
监听有3种方案：
- onpopstate事件（适用于支持H5 History的浏览器）
- onhashstate事件（适用于ie8+）
- 轮询（适用于老旧浏览器）

## 匹配路由
onpopstate/onhashstate/轮询的处理函数都是`checkUrl()`。`checkUrl()`方法会检测URL是否发生了变化，如果是，会去调用`loadUrl()`方法遍历路由表。

## 执行路由回调
对于匹配的路由规则，执行`hander.callback()`，即路由处理函数。


Backbone.History中的大量代码都是处理兼容性，比较难读，如果不了解具体问题的话，很难明白每条逻辑判断是在解决什么。