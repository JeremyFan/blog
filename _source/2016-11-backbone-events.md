# Backbone解析（2）：事件模块

Backbone.Events实现了自定义事件的功能，是一个独立的模块。

### 怎样绑定事件
事件保存在_events这个属性中，是一个map对象。键为事件名，值为事件对象队列。事件对象中包含处理函数（callback），上下文（context），监听此事件的对象（listening）

_events对象：

![](/images/backbone.events.png)

### 如何trigger
有了_events对象，trigger时就可以直接取_events[attr]中事件处理函数。当然有很多细节需要处理。

### 如何实现listenTo？
listenTo用于在一个对象监听另一个对象的事件，这样的好处是更好的区分模块，另外可以一次性移除所有相关的事件监听。最典型的使用场景是，view监听model的'change'事件，做出相应处理，当view被销毁后，可以一次性移除这个view对model所有的事件监听。

监听者有属性_listeningTo指向被监听者，被监听者有属性_listeners指向监听者。

### 如何实现once/listenToOnce？
重写用户绑定时传入的callback，加入调用一次off/stopListening函数。原始的callback保存在变量_callback中，用于用户手动解绑指定的事件处理函数。

### 细节一
`eventsApi`这个函数本身的逻辑是处理`events`参数的不同形式：
- map：`{event: callback}`
- 多个事件（空格分隔）：`"change blur"`
- 单个事件：`click`

```js
var eventsApi = function(iteratee, events, name, callback, opts) {
  var i = 0, names;
  if (name && typeof name === 'object') {
    // Handle event maps.
    if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
    for (names = _.keys(name); i < names.length ; i++) {
      events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
    }
  } else if (name && eventSplitter.test(name)) {
    // Handle space-separated event names by delegating them individually.
    for (names = name.split(eventSplitter); i < names.length; i++) {
      events = iteratee(events, names[i], callback, opts);
    }
  } else {
    // Finally, standard events.
    events = iteratee(events, name, callback, opts);
  }
  return events;
};
```
因为事件参数的格式是统一的，所以多处都会调用这个函数。具体怎么操作events（绑定/解除绑定/触发）通过`iteratee`参数传递。

### 细节二
多处调用方法需要传递`undefined`作为参数的时候，使用`void 0`而不是`undefined`。
```
eventsApi(triggerApi, this._events, name, void 0, args);
```
这样做的好处是：
- 稳定的返回undefined，而undefined有可能被覆盖
- 比undefined少3个字符，减少代码量

### 细节三
`triggerEvents`方法，因为参数的不确定，switch了0~3个参数的情况，使用call调用。多于3个参数的情况，只能使用apply。
```
var triggerEvents = function(events, args) {
  var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
  switch (args.length) {
    case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
    case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
    case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
    case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
    default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
  }
};
```

写法很奇怪，但其实是为了性能考虑。call性能优于apply，而一般来说触发事件带的参数很少会多于3个。

### 细节四
两行代码实现老api兼容。
```
Events.bind   = Events.on;
Events.unbind = Events.off;
```
也许习惯使用bind/unbind绑定/解绑事件。Backbone.Events也是支持的。