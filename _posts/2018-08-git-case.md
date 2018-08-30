---
title: 如何修改Git仓库中文件的大小写
date: 2018/08/17
---

有时候文件名大小写混乱会引起非常严重的问题，比如有个模块叫Module.js，引入的时候没有太注意，写成了

```js
import module from 'path/to/module';
```

如果恰好：
- 开发环境的文件系统大小写不敏感
- 线上环境的文件系统大小写敏感

就会出问题，会导致开发环境正常线上却找不到模块。

<!-- more -->

所以对于文件名的大小写，还是非常推荐遵循一套规范的，免得引起混乱。我觉得比较合理的方式是，看模块的导出：
- 如果模块导出的是类，那么模块首字母要大写；
- 如果模块导出的是对象、数组、字符串等，那么模块首字母就小写。

这符合JavaScript平时的变量命名风格，我们平时命名一个类，会用大写，命名类的实例对象，会用小写。

所以在React应用中，组件导出的是类，首字母是要大写的。

说完了推荐的规范，就要说说如果一个组件一直叫component.jsx，如何修改为Component.jsx。

首先一般来说，git有个配置叫`ignorecase`，是否忽略大小写。
文档说这个配置默认值为false，但可能会在 git-clone 或 git-init 的时候被改成true。
> The default is false, except git-clone[1] or git-init[1] will probe and set core.ignoreCase true if appropriate when the repository is created.

具体规则不明，但我在mac上clone下来的新仓库这个配置都是true。也就是说，如果ignorecase是true的话，直接把组件的名字改为Component.jsx，git是不记录为改动的，所以也无法提交。
所以常见的做法是把这个配置改为false：
```
git config core.ignorecase false
```
这时候再修改组件大小写的时候，git就会记录，但记录的是[U]（updated but unmerged）而不是[R]（renamed），这时候如果把代码提交，会有可能在服务器仓库上出现一个新的组件Component.jsx，老的component.jsx还在。。。

所以改大小写，推荐下面这种做法：
```
git mv component.jsx temp
git mv temp Component.jsx
```
这样改完之后，git记录的是[R]，提交后，服务器仓库上就正常修改了。

参考：
0. git config 文档：https://git-scm.com/docs/git-config
1. git status 各状态的意义：https://git-scm.com/docs/git-status
2. github help 使用命令行重命名文件：https://help.github.com/articles/renaming-a-file-using-the-command-line/#platform-mac
3. git 仓库中如何正确的重命名一个文件夹：https://stackoverflow.com/questions/11183788/in-a-git-repository-how-to-properly-rename-a-directory