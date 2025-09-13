---
pubDatetime: 2021-10-23T16:12:00Z
modDatetime: 2025-09-22T06:25:46.734Z
title: 为 astro 实现的博客添加 i18n 支持
slug: add-i18n-for-astro-blog
featured: true
draft: false
tags:
  - astro
  - i18n
description:
  为 astro 博客添加国际化(i18n)支持的实现方法
---

## 添加语言切换下拉框

博客是使用了[astro-paper](https://github.com/satnaing/astro-paper)模板。

主要是用到了 `Astro.currentLocale` 来获取当前语言。

核心代码：
```
---

const { currentLocale } = Astro

---

<div>
</div>

<script define:vars={{currentLocale}}>

function handleLanguage (code) {
  if (currentLocale === code) return;
  
  // 我的博客只支持中英，默认是英文
  const pathPrefix = code === 'zh' ? '/zh' : ''
  window.location.href = `${window.origin}${pathPrefix}${window.location.pathname.replace(/^\/[^/]*\/posts/, '/posts')}`
}
</script>
```

## 新增内容集合

修改 content.config.ts，增加 zhBlog 和 enBlog，保留原来的 blog，可以少修改点类型不一致导致的打包问题。

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const EN_BLOG_PATH = "src/data/blog/en";
export const ZH_BLOG_PATH = "src/data/blog/zh";
export const BLOG_PATH = "src/data/blog";

function getCollection (base: string) {
    return defineCollection({
        loader: glob({ pattern: "**/[^_]*.md", base: `./${base}` }),
        schema: ({ image }) =>
            z.object({
                author: z.string().default(SITE.author),
                pubDatetime: z.date(),
                modDatetime: z.date().optional().nullable(),
                title: z.string(),
                featured: z.boolean().optional(),
                draft: z.boolean().optional(),
                tags: z.array(z.string()).default(["others"]),
                ogImage: image().or(z.string()).optional(),
                description: z.string(),
                canonicalURL: z.string().optional(),
                hideEditPost: z.boolean().optional(),
                timezone: z.string().optional(),
            }),
    })
}

const zhBlog = getCollection(ZH_BLOG_PATH)

const enBlog = getCollection(EN_BLOG_PATH)

const blog = getCollection(BLOG_PATH)

export const collections = {
    zhBlog,
    enBlog,
    blog
};
```

所有调用 getCollection 的地方需要根据当前语言环境传入 `zhBlog` 或 `enBlog` 来获取对应语言的文章内容。

### 修改博客文件结构

1、在 data\blog 下新增 zh 和 en 两个文件夹，文件夹内放当前语言的文章，文章路径要保持一致，才能实现切换语言时跳转到当前文章的对应语言地址。

2、在 pages 文件夹下新增 zh 文件夹为中文版博客增加对应页面，将原有的 index.astro，about.astro 组件和 tags，posts，archives 文件夹复制到 zh 文件夹中。

3、getPath 函数的修改。根据路径判断是否是中文页面，是的话增加 `/zh` 的路径前缀。

```typescript
/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value
 * @returns blog post path
 */
export function getPath(
    id: string,
    filePath: string | undefined,
    includeBase = true
) {
    const isZHCN = filePath?.startsWith('src/data/blog/zh')

    // Determine which base path to use for replacement
    const contentBasePath = isZHCN ? ZH_BLOG_PATH : EN_BLOG_PATH;

    const pathSegments = filePath
        ?.replace(contentBasePath, "")
        .split("/")
        .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
        .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
        .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
        .map(segment => slugifyStr(segment)); // slugify each segment path


    const urlBasePath = includeBase ? (isZHCN ? "/zh/posts" : "/posts") : ("");

    // Making sure `id` does not contain the directory
    const blogId = id.split("/");
    const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

    // If not inside the sub-dir, simply return the file path
    if (!pathSegments || pathSegments.length < 1) {
        return [urlBasePath, slug].join("/");
    }

    return [urlBasePath, ...pathSegments, slug].join("/");
}
```

### 修改 astro 配置

在 astro.config.ts 的 defineConfig 中的参数对象增加 i18n 对象：

```
{
    i18n: {
        locales: ['en', 'zh'],
        defaultLocale: 'en'
    }
}
```

## 运行 pnpm build 时的类型报错

主要是增加了两种内容集合后，原来那些指定了 blog 内容集合的类型就跟现在的类型冲突了，对应地去修改一下就行。

1、增加总的内容集合类型

现在文章的结构其实都一样，只是内容和标题语言不同而已，所以声明一个新类型替换一下。

```typescript
import type { CollectionEntry } from "astro:content";

export type BlogCollectionEntry = CollectionEntry<"blog"> | CollectionEntry<"enBlog"> | CollectionEntry<"zhBlog">
```

2、Card.astro 的特殊处理

组件内原本是这样：

```
export interface Props extends CollectionEntry<"blog"> {
  variant?: "h2" | "h3";
}
```

但是 typescript 是不允许接口继承联合类型的，所以改成用 type 声明，使用 & 的方式组合类型：

```
import type { BlogCollectionEntry } from "../types";

export type Props = { variant?: "h2" | "h3"; } & BlogCollectionEntry

const { variant = "h2", data, id, filePath } = Astro.props;
```

但是在打包的时候会提示以下错误：

```
[ERROR] [vite] ✗ Build failed in 638ms
Unexpected "&"
  Location:
    D:/Card.astro:32:1
```

虽然32行是正常的元素标签，但问题出在刚刚的类型声明上。解决方法是将类型声明分开定义：

```
import type { BlogCollectionEntry } from "../types";

type PropsType = { variant?: "h2" | "h3"; } & BlogCollectionEntry

export type Props = PropsType

const { variant = "h2", data, id, filePath } = Astro.props;
```
