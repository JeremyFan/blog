---
title: mac os x 10.13编译安装nginx
date: 2017-12-11
---


<!--more-->

## 一、下载源码包

首先，在[官网](http://nginx.org/en/download.html)下载 nginx 的源码包，有3种版本可以选择：

* Mainline version：主线版本，相当于开发版
* Stable version：最新稳定版本
* Legacy versions：历史稳定版本

我选择的是 Stable version 中的 1.12.2，是适用于生产环境的最新稳定版本。

下载后可以解压移动到/usr/local/bin目录下：

```bash
mv nginx-1.12.2.tar.gz /usr/local/bin
```

## 二、配置选项

在[官方文档](http://nginx.org/en/docs/)中可以找到 [Installing nginx](http://nginx.org/en/docs/install.html) → [Building nginx from Sources](http://nginx.org/en/docs/configure.html)，这里介绍了很多编译时可配置的选项，大多是各种路径的配置以及依赖的模块。最下面给出了一个配置示例：

```bash
./configure
    --sbin-path=/usr/local/nginx/nginx
    --conf-path=/usr/local/nginx/nginx.conf
    --pid-path=/usr/local/nginx/nginx.pid
    --with-http_ssl_module
    --with-pcre=../pcre-8.41
    --with-zlib=../zlib-1.2.11
```

对于路径，因为我是新手，所以决定不做配置，用默认的就好；
对于模块，看起来这几个还是要配置一下的。

* with-http_ssl_module：支持 https，需要安装 OpenSSL 或源码包
* with-pcre：PCRE是一个正则库，[ngx_http_rewrite_module](http://nginx.org/en/docs/http/ngx_http_rewrite_module.html)模块依赖，匹配rewrite规则时会用到。
* with-zlib：[ngx_http_gzip_module]依赖，服务端的gzip还是很必要的，所以这个也要配置。

## 三、安装依赖包

### OpenSSL

在[官网下载页](https://www.openssl.org/source/)下到最新稳定版 1.1.0g。

### PCRE

在 [PCRE 官网](http://www.pcre.org/)可以找到[下载地址](https://ftp.pcre.org/pub/pcre/)，注意有两个大版本：8.x和10.x，我最开始下了一个10.x的版本，编译失败了，可能8.x和10.x的接口并不兼容，而且nginx依赖的是8.x。所以这里选择了 pcre-8.41.tar.bz2。是8.x的最高版本，也和示例中的版本一致。

### zlib

zlib 直接选择[官网首页](http://zlib.net/)最新的 1.2.11 版本就可以，也是示例中的版本。

同样把这几个库解压，然后也移动到`/usr/local/bin`（和 nginx 同目录）：

```bash
mv openssl-1.1.0g pcre-8.41 zlib-1.2.11 /usr/local/bin
```

## 四、配置编译

进入之前解压的 nginx 目录：

```bash
cd /usr/lcoal/bin/nginx-1.12.2
```

执行配置命令，几个依赖包的路径对就可以，官方文档提示要写到一行：

```bash
./configure --with-http_ssl_module --with-pcre=../pcre-8.41 --with-zlib=../zlib-1.2.11 --with-openssl=../openssl-1.1.0g
```

一阵 checking 无报错信息之后配置成功——

其实我最开始没有装 OpenSSL，配置的报错提示还是很友好的：

> ./configure: error: SSL modules require the OpenSSL library.
> You can either do not enable the modules, or install the OpenSSL library
> into the system, or build the OpenSSL library statically from the source
> with nginx by using --with-openssl=<path> option.

所以后面我就配置了 `--with-openssl`。

——然后就可以编译了：

```bash
make
```

一阵编译无报错信息之后安装：

```bash
sudo make install
```

赶紧试一试：

```bash
cd /usr/local/nginx
sudo sbin/nginx
```

去浏览器打开 127.0.0.1，看到 nginx 的欢迎页就大功告成啦。
