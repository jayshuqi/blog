---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: Useful Code Snippet
slug: Code Snippet
featured: false
draft: true
tags:
  - uniapp
description:
  Some useful code snippet in uniapp
---

## reload before page lifetime function running in hash mode router

doesn't work in wxwork browser when resources cached
```javascript
window.location.replace(targetUrl)
setTimeout(() => {
    window.location.reload()
})
```
