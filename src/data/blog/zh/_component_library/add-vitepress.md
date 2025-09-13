---
pubDatetime: 2022-09-24T15:22:00Z
modDatetime: 2025-03-25T06:25:46.734Z
title: 组件库添加VitePress
slug: add-vitepress
featured: false
draft: true
tags:
  - vitepress
  - docs
description:
  Add VitePress for a library
---

## Install

run `pnpm add -D vitepress` and `pnpm vitepress init`

Vitepress 会把 docs 文件夹下的markdown文件按路径自动转为html文件。

## custom theme

check official document.

## add custom content on default layout

change `vite.resolve.alias` in `/docs/.vitepress/config.mts` to overwrite default component.

example:
```typescript
export default defineConfig({
    vite: {
        resolve: {
            alias: [
                {
                    find: /^.*\/VPContent\.vue$/,
                    replacement: fileURLToPath(
                        new URL('./path/to/component'),
                        import.meta.url
                    )
                }
            ]
        }
    }
})
```
