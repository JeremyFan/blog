title: Backbone解析（1）：整体架构
date: 2016/11/12
---

整理了一张 Backbone 的架构图。

<!-- more -->

Backbone 的模块划分的非常清晰：
- 事件（Backbone.Events）
- 路由（Backbone.Router、Backbone.History）
- 数据（Backbone.Collection、Backbone.Model、Backbone.Sync）
- 视图（Backbone.View）

Backbone 依赖 jQuery 和 underscore 两个库，其实是依赖`$`和`_`两个对象，实现需要的 API 即可。


![](/blog/images/backbone.png)