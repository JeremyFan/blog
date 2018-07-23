title: 使用 Nodemailer 发邮件
date: 2016/07/12
---

[Nodemailer](https://github.com/nodemailer/nodemailer) 是一个基于Node的邮件服务模块。

使用 Nodemailer 完成一个发邮件功能非常简单，只需3步：
1. 引入模块
2. 创建 transport
3. 发送邮件

<!-- more -->

## 引入模块
首先安装 Nodemailer
```shell
npm install nodemailer
```
引入
```js
var mailer = require('nodemailer');
```

### 创建transport

创建 transport 使用 Nodemailer 的`createTransport`方法，需要配置一下邮件服务。

首先，要在邮箱设置里开启 SMTP 服务。

然后，设置一个客户端授权密码。

最后，写一个配置文件（`conf/mail.js`）。以126邮箱为例：
```
module.exports = {
	host: 'smtp.126.com',
	auth: {
		user: 'user@126.com',
		pass: '******'
	}
}
```
`host`字段配置刚才开启的服务地址。
`auth`里的`user`字段配置邮箱账号，`pass`字段配置刚才设置的授权密码。

这样创建一个 transport：
```
var mailConf = require('conf/mail');
var transport = mailer.createTransport(mailConf);
```

## 发送邮件
发邮件使用 Nodemailer 的`sendMail`方法，需要配置一下邮件内容。

这里配置了发件人，收件人，标题和正文：
```js
var mailOptions = {
  from: mailConf.auth.user,
  to: 'receiver@xxx.com',
  subject: 'Hi, there',
  text: 'Mail from Node!'
}
```
可以像官方文档一样定义一个回调函数：
```js
function mailCallback(error, info){ 
  if(error){ 
    return console.log(error); 
  } 
  console.log('Message sent: ' + info.response);
}
```
然后，就可以发送邮件了：
```js
transport.sendMail(mailOptions, mailCallback);
```

## 总结
这样就完成了最基本的发邮件功能。

[Nodemailer文档](http://nodemailer.com/) 非常详细，可以探索实现更多功能。