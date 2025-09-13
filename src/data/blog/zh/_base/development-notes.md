---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: 开发笔记
slug: development-notes
featured: false
draft: false
tags:
  - note
description:
  文章记录开发过程中遇到的问题及其解决方法，和不清楚的知识点。
---

## git 命令

### git log
获取所有提交记录，按行输出。

#### --pretty 参数
设置输出格式，如：`--pretty=format:%s %h` 参数，其中 %s 指主题，%h 指提交的哈希缩写，所以输出格式会被设置为：`主题 git提交的哈希缩写`。

#### 设置输出范围

git log 命令后跟 `"$previous_tag".."$current_tag"` 将会输出从 `previous_tag` 变量(不包括)所代表的 git 提交 tag 到 `current_tag` 的提交记录。

### git rev-parse
这个底层命令主要用于解析git 引用为哈希值。

#### --abbrev-ref HEAD
--abbrev-ref 修饰符让 rev-parse 输出被解析的引用的缩写名称。HEAD 通常指向当前所在分支。

最终输出的是当前分支的缩写名称。

### git fetch
从远程仓库获取最新提交、分支等数据，但不合并或修改当前代码。运行后可以使用 git log origin/分支名 来查看最新更新。

#### --prune
更新时清理远程仓库中已不存在而本地存在的分支。

### git pull
从远程仓库获取更新并合并到当前分支。等于运行了 git fetch + git merge origin/当前分支名

### git tag
列出所有标签。后面跟形如 v1.0.0 的修饰符的话就会创建标签。

#### --sort
git tag 排序修饰符。

如 `--sort=-version:refname`按版本号倒序显示标签，其中 `-` 表示倒序，`version:` 前缀让 git 把标签名理解为版本号而不是普通字符串，
`refname` 指标签的名字本身。

## 计算机基础

### 二进制
1 byte = 8 bits。bit 是二进制最小单位。UTF-8编码会把一个 unicode 字符转换成若干个8位字节。

### 十六进制
1个十六进制数 = 4位二进制。两个十六进制数即可表示一个字节（8位）。

js 中的十六进制表现方式有：
- 0x。十六进制数值的标准表示
- %。URL编码。
- \x。表示一个字节。（latin1范围，0-255）
- \u。表示一个unicode code unit。（两个字节）

### UTF-16
UTF-16编码中，最小的数据单位固定就是 16位。有些 unicode 需要2个 code unit 才能完整表示。

JS 引擎内部始终使用 UTF-16 存储所有字符串。字符串由一系列16位的 code unit 组成。

## JavaScript 中的二进制

### << 操作符
`<<` 左移操作符，将数字左移指定位数。左移后右侧补0，相当于数值乘以2的移动位数的次方。

### >>> 操作符
`>>>` 无符号右移操作符。

### 掩码
`|` 操作符对两个数的每一位进行比较, 只要有一个为1，结果位就是1，所以用来给二进制数赋值很方便。

`&` 只有在两个操作数对应的二进制位都为1时，结果位才为1, 所以用来取值很方便。

例如:
```
let a = (num >>> 12) & 63
```

63 用二进制表示是 00111111，所以 a 的值是 num 变量的最右边6位二进制。

### Uint8Array
`Uint8Array` 表示 8 位无符号整型数组，用于存储二进制数据。数组的长度就是总字节长度。

### btoa
`btoa` 将二进制/ latin1 编码的字符串转为 base64 编码的 ASCII 字符串。

除了 latin1 编码的字符，其他类型的字符会先转为 utf-8 后再进行编码。

### encodeURI
`encodeURI` 不会对 URI 中的 ASCII 字母、数字、标点符号进行编码： - _ . ! ~ * ' ( ) ，其他都会被编码。
但对以下在 URI 中具有特殊含义的 ASCII 标点符号，encodeURI() 函数是不会进行转义的：;/?:@&=+$,#

### encodeURIComponent
`encodeURIComponent` 不会对 ASCII 部分字符进行编码，包括标点符号 - _ . ! ~ * ' ( ) ，大小写字母，数字，其他都会被编码。

两个方法都是先把字符转成utf-8编码的单字节序列，而每个字节可以用两个十六进制字符来表示，再在每个字节（2个十六进制位）前加一个`%`。

> 例如，汉字 “你” 的 Unicode 是 U+4F60，它的 UTF-8 编码是 0xE4 0xBD 0xA0（三个字节）。
> 0xE4 = 二进制 11100100，1110 = E   0100 = 4，十六进制字符：E4，然后 URL 编码格式就是：%E4
> 每个字节都可以写成 %E4、%BD、%A0，这就是 URL 编码的样子。

### escape
将字符串中的特殊字符转为十六进制表示(%/%u+xx)，对于小于255范围内的字符和 encodeURIComponent 表现一致，对于大于255的 输出 %uXXX，保留了
整个四位十六进制的码点。

不编码的ASCII字符：大小写字母、数字和标点符号 - _ . * @ + /

ASCII 字符（0-255）： 转换为 %XX 格式（XX 是十六进制值）。

Unicode 字符（> 255）： 转换为 %uXXXX 格式（XXXX 是 4 位十六进制 Unicode 码点）。

### unescape
将 %/%u 开头的十六进制字符解码成码点位0xXX/0xXXXX（latin1范围内的单字节）。并不关心是不是 `escape` 不编码的ASCII字符。

所以即使 escape 不编码 `@ + /` ，被 encodeURIComponent 处理后的 `@ + /` 还是会被 unescape 解码。

### String.fromCharCode
JavaScript 的字符串底层是由一系列 16 位的 code unit（数值 0–65535）组成。

String.fromCharCode(n) 会创建一个包含单个 code unit 值为 n 的字符串。

### String.charCodeAt
`String.charCodeAt` 返回字符的 unicode 码点。

## shell

### $
`$` + 变量名可以引用变量。

### grep
`grep`，文本搜索命令

`-E` 修饰符表示使用正则、无匹配文本就返回 `1`。

### |
`|` 将左侧的输出传递给右侧作为输入。

### ||
如果操作符左侧退出码为0，就跳过右侧命令的执行，否则的话就执行右侧命令。

### $()
`$()` 会运行括号内的命令并将输出作为结果参与接下来的命令运算中。 

### echo
`echo`，打印命令，将文本或变量内容显示到标准输出设备。

`echo -e` 用于启用

#### in github actions
在 github actions 中，`::` 是用于和github actions 通信的特殊指令，被识别到时 echo 后的文本就会被认为是指令而不是普通文本。

`::set-output name=变量名::变量值` 就能为 job 定义变量，后续通过 `${{steps.step的id.outputs.变量名}}` 来引用变量。

### true
`true` 会返回退出码 0。

### @
`${array[@]}` 会将数组所有元素展开。

### set -e
一般 shell 脚本运行时会忽略非 0 退出码。而有了 `set -e`，如果出现非 0 退出码脚本就会立即停止执行。

### 条件判断
`if ... ; then`，如果 if 后面条件成立就会运行 then 后面的命令。

`for (变量名) in (列表类型的变量名); do` 会循环列表并运行循环体代码。`done` 用于标识循环的结束， `fi` 标识 if 判断的结束。

### [[]]
`[[]]` 用于条件判断， 例如 `[["$message"]]` 判断变量长度非零，则为真，和 `[[ -n "$message" ]]` 作用一样。

### \>
`>` 用于重写文件，后面跟文件名。

### cat
`cat` 读取文件内容并输出在命令行。

## node

### __dirname 和 process.cwd

```
- ui
  - scripts
    - test.ts
```

此时 test.ts 内代码运行结果：

```typescript
process.cwd() // D:\code\ui
__dirname // D:\code\ui\scripts
```
