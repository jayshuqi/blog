---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: Javascript实现Base64编码
slug: jsbase64
featured: true
draft: true
tags:
  - JavaScript
  - Base64
description:
  这篇文章讲的是在Javascript中实现Base64编码。
---

## base64编码使用的字符
标准Base64包含A-Z, a-z, 0-9, +, /, =，url安全的base64包含A-Z, a-z, 0-9, -, _, =，因为+和/在url中有特殊含义。

## 核心思路
Base64 将3字节（24位）的二进制数据转换为6位一组的片段，每个6位片段作为索引映射到64个可打印字符（前面提到的字符）之一。上述字符正是这64个字符的完整集合。

> 字节不足时用 = 填充

## 实现

```javascript
const str = 'hello'
// unescape(encodeURIComponent(str)) 解决非 Latin1 字符集（即每个字符 1 字节，0-255）的字符
const base64 = btoa(unescape(encodeURIComponent(str)))
```

```javascript
// 假如 btoa 函数不存在
const UInt8ArrayToBase64 = (target: Uint8Array) => {
    let result = ''
    for (let i = 0; i < target.length; i += 3) {
        const [binary1, binary2, binary3] = [target[i], target[i + 1], target[i + 2]]
        const binaryStr = (binary1 << 16) | (binary2 << 8) | binary3
        result += B64_CHARS[binaryStr >> 18]
        result += B64_CHARS[(binaryStr >> 12) & 63] || '='
        result += binary2 !== undefined ? B64_CHARS[(binaryStr >> 6) & 63] : '='
        result += binary3 !== undefined ? B64_CHARS[binaryStr & 63] : '='
    }
    return result
}
const _btoa = (s: string) => {
    if (s.charCodeAt(0) > 255) {
        throw new RangeError('The string contains invalid characters.')
    }
    return UInt8ArrayToBase64(Uint8Array.from(s, (c: string) => c.charCodeAt(0)))
}
```


