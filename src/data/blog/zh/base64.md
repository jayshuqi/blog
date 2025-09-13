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
  This article covers base64 encoding and decoding in JavaScript.
---

## base64 character definition
Base64 includes A-Z, a-z, 0-9, +, /

## core
Base64 将3字节（24位）的二进制数据转换为6位一组的片段，每个6位片段作为索引映射到64个可打印字符之一。上述字符正是这64个字符的完整集合。

> 字节不足时用 = 填充

## implementation

```javascript
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
```


