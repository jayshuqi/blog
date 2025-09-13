---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: JavaScript Implementation of Base64 Encoding
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
Base64 converts 3 bytes (24 bits) of binary data into 6-bit segments, with each 6-bit segment mapped as an index to one of 64 printable characters. The aforementioned characters are exactly the complete set of these 64 characters.

> When bytes are insufficient, pad with =

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


