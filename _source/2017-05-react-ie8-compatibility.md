# React 体系兼容 IE8 的版本探讨

想用可以兼容到 IE8 的最高版本...

## 相关项目
- react
- react-router
- react-redux
- redux

## 目的
确保使用一个可以兼容 IE8 的版本。

## 使用旧版本？
旧是个相对的概念，与传统的框架相比，这些项目有非常新的思想。

其实大家也都在用旧版本。引用 Tim Dorr 的一段话：
> You don't have to upgrade to every new release immediately. It's OK to run slightly out of date versions of stuff. Want to know how I know? This very website, GitHub, is running on a version of Rails that is about 5 years old at this point. And that's OK.


## react
react 宣布 15.x 不再支持 IE8。官方推荐需要兼容 IE8 的用户使用 0.14.x 版本。

> Starting with React v15, we're discontinuing React DOM's support for IE 8. We've heard that most React DOM apps already don't support old versions of Internet Explorer, so this shouldn't affect many people. This change will help us develop faster and make React DOM even better. (We won't actively remove IE 8–related code quite yet, but we will deprioritize new bugs that are reported. If you need to support IE 8 we recommend you stay on React v0.14.

[Discontinuing IE 8 Support in React DOM](https://facebook.github.io/react/blog/2016/01/12/discontinuing-ie8-support.html )

2016.3月发布v0.14.8

## react-router
没有找到关于 IE8 兼容性的明确说明。

准备暂用 2.x 版本

2.x 最高版本 v2.8.1 2016.9月发布

## react-redux
react-redux 没有找到官方的兼容性声明，但 Dan Abramov 在一个 issue 中说 5.x 版本不再兼容 ie8：
> We just had a regression that forced us to go back to CommonJS: rackt#233. I'm happy to revert this in React Redux 5 where we'll drop IE8 compat though.

> Seems inconvenient to add Browserify transforms to Webpack build.
And we don't want to support IE8 forever anyway. React is dropping it in next version, and so do we.

所以使用 4.x 版本，也相当于是最新的版本了。
v4.4.8 2017.4月发布。

## redux
Dan Abramov 打算 redux 4 不再支持 IE8：
> Drop support for IE8. This doesn’t mean there is anything specific we want to break, but rather that “we don’t support IE8” will be our official position from the next major release and on. React Redux will also bump the major because of this.

Tim Dorr 说：
> Folks, we only said we're dropping support for IE8. No other version. If you need support for that version, you can continue to use 3.x. We won't be unpublishing that version on release of 4.0 and it will continue to work just fine, as it does right now.

[Redux 4 breaking changes](https://github.com/reactjs/redux/issues/1342 )

4.0 版本应该还在开发中。所以可以使用目前 3.x 的最新版本。
2016.9月发布v3.6.0