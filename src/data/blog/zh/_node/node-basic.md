---
pubDatetime: 2021-10-05T09:01:50Z
modDatetime: 2023-05-10T10:09:00Z
title: node基础
slug: node-basic
featured: false
draft: true
tags:
  - node
description:
  node基础知识
---

## 运行
`node` + 文件名或通过cmd文件来注册一个命令运行执行文件。

node 命令运行：
```shell
node hello.js
```

windows 中注册命令：

创建一个test.cmd文件：
```shell
@node "D:\code\test.js" %*
```

> @ 用于隐藏后面跟着的命令。node + 路径是执行指定文件，&*会把运行 test 时传入的参数传递到文件中。

然后在 PATH 中添加test.cmd所在路径，就能运行 test 命令。

## node中的模块

## 初始化
模块在第一次被引入时被执行并初始化导出对象，导出对象是个单例，会被缓存。

## 使用
每个 js 文件都视为一个模块，可以使用 `require`, `exports` 和 `module`。require 根据路径引入模块，exports 对象是当前模块导出的对象，
可以往对象上添加属性或函数。module对象包含当前模块的信息，其中module.exports是当前模块到处对象，可以被替换，例如替换成函数。

### 模块导入
require 解析路径顺序，除了内置模块，都是先搜索当前目录下的node_modules，找不到就在父文件夹的node_modules找，再找不到继续往上找。此外还
支持NODE_PATH环境变量设置搜索多个目录。

- 以index为名字的模块可以将其所在路径传入require，同样会被解析到
- 有package.json的目录，require会根据其中的main字段解析模块导出的内容

## 异常处理
内部模块提供的异步方法一般都有个回调函数的参数，回调函数的第一个参数是错误对象，第二个参数是api结果。一般异步方法名称后加Sync就是同步方法，
同步方法返回的是结果，如果报错需要通过 try catch 来捕获。

## 常见功能

### 文件拷贝
小文件拷贝可以用 `fs.readFileSync`, `fs.writeFileSync`，大文件就得用 `fs.createReadStream(src).pipe(fs.createWriteStream(dest))`，
也可以通过 `fs.createReadStream` 创建的实例监听 `data` 事件，在监听函数中实现拷贝和读取速度的控制，不然可能出现 'data' 不断触发而写入速度跟不上，导致数据在
内存中堆积而内存溢出，`pipe` 内部已实现类似控制。

```javascript
const fs = require('fs');

function copyWithBackpressure(src, dest) {
    const rs = fs.createReadStream(src);
    const ws = fs.createWriteStream(dest);
    
    rs.on('data', (chunk) => {
        // 检查写入流是否能接受更多数据，false表示需要暂停
        const canAcceptMore = ws.write(chunk);
        
        if (canAcceptMore === false) {
            console.log('背压：暂停读取，等待写入完成...');
            rs.pause(); // 关键：暂停读取
        }
    });
    
    // 当写入流缓冲区空时，只写数据流已经将缓存中的数据写入目标，可以传入下一个待写数据了
    ws.on('drain', () => {
        console.log('背压：写入完成，恢复读取...');
        rs.resume(); // 关键：恢复读取
    });
    
    rs.on('end', () => {
        ws.end();
    });
    
    rs.on('error', (err) => {
        console.error('读取错误:', err);
    });
    
    ws.on('error', (err) => {
        console.error('写入错误:', err);
    });
}
```
