# 一个帮助项目生成目录结构的vscode扩展

之前发现 express 官网的这种项目结构很好看：

有时候写文档，也需要展示类似的项目结构。
但这种结构手写的话其实很麻烦，尤其是增删的时候需要修改前面树枝的形状，包括控制缩进等等。
所以写了一个插件（vscode-dirstructure）来做这件事。

## 功能
如果不考虑展示，用缩进控制目录层级，上面的结构可以写成：
```
app.js
bin
  www
package.json
public#资源文件
  images
  javascripts
  stylesheets
    style.css
routes#路由
  index.js
  users.js
views#页面模板
  error.pug
  index.pug
  layout.pug
```
vscode-dirstructure做的事情就是把上面的原始结构翻译成 express 官网目录的形式。
只需要选中原始结构，然后按下`Option+i `，选择 toTree 就可以。
转换后的样子：
```
.
├── app.js
├── bin
│   └── www
├── package.json
├── public ··············· 资源文件
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes ··············· 路由
│   ├── index.js
│   └── users.js
└── views ················ 页面模板
    ├── error.pug
    ├── index.pug
    └── layout.pug
```
vscode-dirstructure多做了一些东西就是可以在`#`后面添加注释，注释会自动添加到结构中。
如果想要编辑的话，选中树状结构，然后按下`Option+i `，选择 toMD 就可以。

## 安装
打开 vscode 应用商店，搜索 dirstructure 即可。

## 操作
1. 选中要编辑的内容
2. `Option+i`呼出菜单
3. 选择`toTree`或`toMD`

观看演示或代码：https://github.com/JeremyFan/vscode-dirstructure