---
pubDatetime: 2022-09-24T15:22:00Z
modDatetime: 2025-03-25T06:25:46.734Z
title: Adding VitePress to Component Library
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

Run `pnpm add -D vitepress` and `pnpm vitepress init`

Vitepress will automatically convert markdown files in the docs folder to HTML files by path.

## Custom Theme

Check official document.

## Add Custom Content on Default Layout

Change `vite.resolve.alias` in `/docs/.vitepress/config.mts` to overwrite default component.

Example:
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
