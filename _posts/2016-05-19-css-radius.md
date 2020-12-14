---
title: 一种奇特的 css 实现圆角方法
date: 2016-05-19
---

实现圆角，最常用的是使用**背景图**和`border-radius`属性。但看到一种思路比较奇特的实现。

![radius.png](../blog/images/radius.png)

<!--more-->

## 圆角背景图
```css
background: url(./bg.png);
```
- 优点：兼容各浏览器
- 缺点：适应性不好，无法拉伸；需要请求图片资源。


## border-radius
```css
border-radius: 5px;
```
- 优点：可拉伸，简单方便，`CSS`实现
- 缺点：只兼容现代浏览器

## 看到的方法
这个方法就略奇葩，但确实出现在了我们的产品中。大致思路是使用不同宽度的1px直线达到渐变的效果。
具体来说：使用几个`<b>`标签，用`margin`控制宽度，从上到下一次变长，造成一种圆角的感觉。

![clipboard.png](../blog/images/radius_2.png)

所以这个圆角其实只是模拟的圆角，并不是很圆，但应该也瞒混的过去...

个人感觉
- 优点：兼容各浏览器，可拉伸，`CSS`实现
- 缺点：代码太复杂；圆角其实并不是特别圆...

HTML代码：
```html
<div class="box line">
  <b class="line line1"></b>
  <b class="line line2"></b>
  <b class="line line3"></b>
  <b class="line line4"></b>
  <div class="box-content"></div>
  <b class="line line4"></b>
  <b class="line line3"></b>
  <b class="line line2"></b>
  <b class="line line1"></b>
</div>
```
CSS代码：
```css
.box{
  width:200px;
  height:62px;
  margin:20px;
}
.box .line{
  display:block;
  height:1px;
  overflow: hidden;
  background: #09f;
}
.box .line1{ margin:0 5px; }
.box .line2{ margin:0 3px; }
.box .line3{ margin:0 2px; }
.box .line4{ margin:0 1px; }
.box .box-content{
  width:200px;
  height:52px;
  background: #09f;
}
```

### 总结
运用一些想象力，`CSS`可以实现很多好玩的东西。不过对于圆角，个人还是喜欢`border-radius`的实现，因为简单，代码简洁，低版本浏览器退化到直角，也是非常好看的，有时候甚至觉得直角比圆角还好看。
