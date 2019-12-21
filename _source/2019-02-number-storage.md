# JavaScript 数值的存储
JavaScript 中的数值类型用起来很简单，但内部如何存储却是有点复杂。我们在使用的过程也偶尔会遇到一些问题，比如为什么整数被截断了，为什么小数计算不精准了。

这篇文章就主要来讨论这些问题，具体来说，在 JavaScript 中：
1. 数值是如何存储的？
2. 为什么能够精确表示的整数范围是 `-9007199254740991~9007199254740991`？ 
3. 为什么能够表示的最大数值范围是 `5e-324~1.7976931348623157e+308`？
4. 为什么 `0.1+0.2` 不等于 0.3？ 

## 一、数值的存储
提到 JavaScript 的数值存储，就不能不提 IEEE754 标准，因为 JavaScript 就是以 IEEE754 标准的双精度浮点数存储数值的。

按照 IEEE754 标准，计算机中的数值都以二进制科学计数法表示，也就是 `1.0101 * 2e+5` 这种（随便写的一个数），可以认为一个数值是由**符号（sign）**、**指数部分（exponent）**、**小数部分（fraction）**三块组成。

![](https://raw.githubusercontent.com/JeremyFan/static/images/blogs/ieee754-64.png)

那么这三部分具体是如何存储的呢？在 IEEE754 的双精度浮点数规范中，计算机会使用 8 个字节共 64 位表示一个数值，相应的分成三个部分：
- 最高位是符号位
- 第 2~12 位是指数位
- 第 13~64 位是小数位


下面分别来说明这三个部分。

### 符号位（sign）
这个比较好理解，专门一个 bit 表示数值的正负，当符号位为 0 时，表示正数；当符号位为 1 时，表示负数。

### 指数位（exponent）
指数位共有 11 位，可表示的最小值是 0，最大值是 2047（即 `2e11-1`）。指数也有正负，指数的正负并没有使用符号位表示，而是使用了偏移量的设计，对于双精度浮点数来说偏移量是 1023，也就是说真实指数值会加上 1023 后存储。比如 -2 存储为 1021，0 存储为 1023，10 存储为 1033。所以指数位存储的值是 `0~2047`，实际指数值的范围是 `-1023~1024`。

但 -1023 和 1024 作为边界情况，要去表示特殊值，简单的说就是：
- 如果指数位是 -1023，而小数位是 0，那么就表示数字 0，加上符号位就是 +-0；
- 如果指数位是 1024，分两种情况：
    - 小数位是 0，表示 `Infinity`，加上符号位就是 `+-Infinity`
    - 小数位大于 0，表示 `NaN`

### 小数位（fraction）
小数位共有 52 位，由于二进制科学计数法的小数部分总是 1.xxx，所以第1位就被省略了，52位全部用来表示小数点后面的部分。

## 二、数字 1 是如何存储的？
了解了存储方式后，我们先来看看一个最简单的数值（十进制数字 1）是如何存储的。

对于十进制数字 1，用科学计数法可以表示为 `1.0 * 10e0`，转换成二进制科学计数法就是 `1.0 * 2e0`。可以很明显的看出：
- 因为是正数，符号位是 0；
- 指数位也是 0，偏移后就是1023，也就是二进制 01111111111
- 小数位全是 0

所以整体表示为：

<font color="#00c">0</font> <font color="#360">01111111111</font> <font color="#900">0000000000000000000000000000000000000000000000000000</font>

（蓝色是符号位，绿色是指数位，红色是小数位）

## 三、为什么能够精确表示的整数范围是 `-9007199254740991~9007199254740991`？
```js
Number.MAX_SAFE_INTEGER
// 9007199254740991
Number.MIN_SAFE_INTEGER
// -9007199254740991
```

为什能够精确表示的整数范围是 `-9007199254740991~9007199254740991（-2e53+1~2e53-1）`呢？

或者问 JavaScript 中的最大安全整数，也就是 `Number.MAX_SAFE_INTEGER` 与 `Number.MIN_SAFE_INTEGER` 的值，为什么分别是 `-2e53+1` 和 `2e53-1` 呢？

先来理解一下安全整数的概念，所谓安全整数，指的是对于一个数值 n，n 和 n+1 都是精确的。

先举一个不精确的例子—— `2e53`，然后会发现 `2e53` 和 `2e53+1` 居然是相等的：

```js
Math.pow(2, 53)
// 9007199254740992
Math.pow(2, 53) + 1
// 9007199254740992
```

所以 `2e53` 不是一个安全整数。

我们先来看下 `2e53-1` 的表示是 `1.11111……（小数点后 52 个 1） * 2e52`，加 1 后变成 `1.00000……（小数点后 52 个0）* 2e53`，这个时候再加 1 呢？只要把小数点后第 53 位的 0 变成 1 即可，即 `1.00000……1（小数点后 52 个0，1 个 1） * 2e53`是  `2e53+1`，但是实际小数位一共只有 52 位，第 53 位会被截掉，截掉后小数点后面还是 52 个 0，所以 `2e53` 和 `2e53+1` 是相等的。但如果是 `2e53+2`，我们发现第 52 位变成 1 即可，即 `1.00000……1（小数点后51个0，1个1） * 2e53`，所以  `2e53+2` 又是正常的。

|   |   |
| - | - |
| 2e53-2 | 9007199254740990 |
| 2e53-1 | 9007199254740991 |
| 2e53   | 9007199254740992 |
| 2e53+1 | 9007199254740992 |
| 2e53+2 | 9007199254740994 |

所以这个问题可以理解为，小数位数（有效数字）必须大于指数值，才能精准表示整数。

比如对于十进制的科学计数法，假设只能有两位有效数字，那么最大安全数就是 `9.99 * 10e2`，即 `10e3-1`，对于 `1000（1.00 * 10e3）`以后的整数，只有表示 `1.01 * 10e3（1010）`、`1.02 * 10e3（1020）`等是准确的，中间的 1011、1012 都无法被准确表示。

所以对于二进制表示的 JavaScript 整数来说，当指数大于或等于 53 时，52 个小数位就不能再精准的表示了，所以 JavaScript 中最大的安全整数是 `2e53-1`。最小的安全整数也一样，是 `-(2e53-1)`，即 `-2e53+1`。

## 四、为什么能够表示的最大数值范围是 `5e-324~1.7976931348623157e+308`？
```js
Number.MAX_VALUE
// 1.7976931348623157e+308
Number.MIN_VALUE
// 5e-324
```

首先明确一点，这两个数值都是大于 0 的，一个是最接近 `Infinity` 的数值，一个是最接近 `0` 的数值，为什么是这两个值呢？这个问题比较好回答一些，了解到 JavaScript 数值的存储方式后，只需按最大最小计算一下就可以了。

对于最大数值：
除去边界值，指数位最大是 1023。而小数位最大就是 52 位全部是 1，二进制表示为 1.11111……（小数点后52个1，这个值转成十进制是 `1.9999999999999998`），所以 JavaScript 可以表示的最大数是

1.<font color="#900">1111111111111111111111111111111111111111111111111111</font> * 2e1023

算出来就是 `1.7976931348623157e+308` 了。

```js
1.9999999999999998 * Math.pow(2, 1023)
// 1.7976931348623157e+308
```

对于最小数值：
除去边界值，指数位最小是 -1022。而小数位最小就是 52 位中的前 51 位全部是 0，最后一位是 1，二进制表示为1.000……1（中间 51 个 0，转成十进制是 `2.220446049250313e-16`），所以 JavaScript 可以表示的最小数是

1.<font color="#900">0000000000000000000000000000000000000000000000000001</font> * 2e1023

算出来就是 `5e-324` 了。

```js
2.220446049250313e-16 * Math.pow(2, -1022)
// 5e-324
```

## 五、为什么 0.1+0.2 不等于 0.3？
好了。现在对于 JavaScript 数值的存储都已经了解了。现在我们来看最后一个问题：为什么 `0.1+0.2` 不等于 0.3

```js
0.1 + 0.2
// 0.30000000000000004
```

首先我们要把 0.1 和 0.2 转换成二进制科学计数法表示，十进制小数转二进制的方法不要忘记了，就是一直**乘 2 取整，直到小数点后为 0**。

### 转换 0.1

| 计算值 | 乘2 | 取整 | 本轮计算结果 |
| - | - | - | - |
| 0.1 | 0.2 | 0 | 0.0 |
| 0.2	| 0.4	| 0	| 0.00 |
| 0.4	| 0.8	| 0	| 0.000 |
| 0.8	| 1.6	| 1	| 0.0001 |
| 0.6	| 1.2	| 1	| 0.00011 |
| 0.2	| 0.4	| 0	| 0.000110 |
| 0.4	| 0.8	| 0	| 0.0001100 |
| …… | ……	| …… | …… |

算到这里，应该已发现了，这样乘下去，永远也不会结束。所以会得到一个循环小数，0.000110011……（0011循环）。表示成科学计数法是：

1.<font color="#900">1001100110011001100110011001100110011001100110011001</font> 10011……（0011循环） * 2e-4

因为小数位（红色部分）只有52位，所以我们要舍去多余的部分，根据 **0 舍 1 入**的规则，我们最终得到：

1.<font color="#900">1001100110011001100110011001100110011001100110011010</font> * 2e-4

### 转换 0.2
对于0.2，用同样的方法计算，得到的结果是 0.00110011……（0011循环）。

表示成科学计数法是：

1.<font color="#900">1001100110011001100110011001100110011001100110011001</font> 10011  * 2e-3

舍去多余的部分，得到：

1.<font color="#900">1001100110011001100110011001100110011001100110011010</font>  * 2e-3

经过这一步转换发现，0.1 和 0.2 都无法精确转换成二进制科学计数法表示，所以也不能被精确存储，于是计算结果出现意外也就不奇怪了。

### 计算 `0.1+0.2`
我们接着来计算 `0.1+0.2`，首先两个数值的指数位是不同的，我们必须把指数位统一，规则就是把指数位统一成较大的那个。于是 0.1 被转换成：

0.<font color="#900">1100110011001100110011001100110011001100110011001101</font> 0 * 2e-3

舍去多余的小数位：

0.<font color="#900">1100110011001100110011001100110011001100110011001101</font> * 2e-3

我们把 0.1 和 0.2 的小数部分相加

0.<font color="#900">1100110011001100110011001100110011001100110011001101</font> * 2e-3
1.<font color="#900">1001100110011001100110011001100110011001100110011010</font> * 2e-3

结果得到：

10.<font color="#900">0110011001100110011001100110011001100110011001100111</font> * 2e-3

转换成标准的科学计数法：

1.<font color="#900">0011001100110011001100110011001100110011001100110011</font> 1 * 2e-2

舍去多余的小数位最终得到：

1.<font color="#900">0011001100110011001100110011001100110011001100110100</font> * 2e-2

很明显，`0.1+0.2` 的最终结果是一个近似值。那么 0.3 就是准确的吗？

### 转换 0.3
同样的，我们来计算 0.3

| 计算值 | 乘2 | 取整 | 本轮计算结果 |
| - | - | - | - |
| 0.3	| 0.6	| 0	| 0.0
| 0.6	| 1.2	| 1	| 0.01
| 0.2	| 0.4	| 0	| 0.010
| 0.4	| 0.8	| 0	| 0.0100
| 0.8	| 1.6	| 1	| 0.01001
| 0.6	| 1.2	| 1	| 0.010011
| 0.2	| 0.4	| 0	| 0.0100110
| …… | ……	| …… | …… |

得到：

0.<font color="#900">0100110011001100110011001100110011001100110011001100</font> 110011……（0011循环）

转换成二进制科学计数法，并舍入多余的小数位，最终得到

1.<font color="#900">0011001100110011001100110011001100110011001100110011</font> * 2e-2


确实和 `0.1+0.2` 的结果不相等。
总结一下，0.1 和 0.2 在各自存储以及相加的过程中均有取近似值操作，所以最终的结果也是不精确的。


## 六、相关解决方案
1. 对于整数被截断的情况，比如有时前端会从接口中取比 JavaScript 最大安全数还大的整数（比如订单号之类的），这时建议还是用字符串来表示。
2. 对于小数算不准的情况，可以把小数转换成整数计算再转回去。另外 ES6 提供了一个常量 `Number.EPSILON`，浮点数计算的误差，都会比这个常量小。即 `0.1+0.2-0.3 < Number.EPSILON`，我们可以认为 `0.1+0.2` 和 0.3 是相等的。


## 参考文档
1. IEEE 754标准：https://zh.wikipedia.org/wiki/IEEE_754
2. 在线进制转换：https://www.sojson.com/hexconvert.html
3. How numbers are encoded in JavaScript：http://2ality.com/2012/04/number-encoding.html
4. Here is what you need to know about JavaScript’s Number type：https://medium.com/dailyjs/javascripts-number-type-8d59199db1b6
5. How to round binary numbers：https://blog.angularindepth.com/how-to-round-binary-fractions-625c8fa3a1af
6. Number.EPSILON：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON