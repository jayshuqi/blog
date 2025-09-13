---
pubDatetime: 2021-10-23T16:12:00Z
modDatetime: 2025-09-22T06:25:46.734Z
title: Adding i18n Support to an Astro Blog
slug: add-i18n-for-astro-blog
featured: true
draft: false
tags:
  - astro
  - i18n
description:
  Add i18n support for Astro blog
---

## Adding a Language Switcher Dropdown

The blog uses the [astro-paper](https://github.com/satnaing/astro-paper) template.

The main approach uses `Astro.currentLocale` to get the current language.

Core code:
```
---
const { currentLocale } = Astro
---

<div>
</div>

<script define:vars={{currentLocale}}>
function handleLanguage (newValue) {
  if (currentLocale === code) return;
  
  // My blog only supports Chinese and English, with English as default
  const pathPrefix = code === 'zh' ? '/zh' : ''
  window.location.href = `${window.origin}${pathPrefix}${window.location.pathname.replace(/^\/[^/]*\/posts/, '/posts')}`
}
</script>
```

## Adding Content Collections

Modify content.config.ts to add zhBlog and enBlog, keeping the original blog to minimize type inconsistency issues during build.

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

Modify all places that call getCollection to pass `zhBlog` or `enBlog` based on whether it's Chinese or English.

### Modifying Blog File Structure

1. Add zh and en folders under data\blog, placing articles in the respective language folders. The article paths must remain consistent to enable language switching to the corresponding language address of the current article.

2. Add a zh folder under the pages folder to create corresponding pages for the Chinese version of the blog. Copy the existing index.astro, about.astro components and tags, posts, archives folders into it.

3. Modify the getPath function. Determine whether it's a Chinese page based on the path, and add the `/zh` path prefix if it is.

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

### Modifying Astro Configuration

Add an i18n object to the parameter object in defineConfig in astro.config.ts:

```
{
    i18n: {
        locales: ['en', 'zh'],
        defaultLocale: 'en'
    }
}
```

## Type Errors During pnpm build

The main issue is that after adding two content collections, the original types that specified the blog content collection now conflict with the current types. Simply modify them accordingly.

1. Add a unified content collection type

The structure of articles is actually the same now, only the content and title languages are different, so declare a new type to replace it.

```typescript
import type { CollectionEntry } from "astro:content";

export type BlogCollectionEntry = CollectionEntry<"blog"> | CollectionEntry<"enBlog"> | CollectionEntry<"zhBlog">
```

2. Special handling for Card.astro

Originally in the component:
```
export interface Props extends CollectionEntry<"blog"> {
  variant?: "h2" | "h3";
}
```

However, TypeScript does not allow extending union types, so change it to use type declaration with the & approach:

```typescript
import type { BlogCollectionEntry } from "../types";

export type Props = { variant?: "h2" | "h3"; } & BlogCollectionEntry

const { variant = "h2", data, id, filePath } = Astro.props;
```

But during build, it will prompt:

```
[ERROR] [vite] ✗ Build failed in 638ms
Unexpected "&"
  Location:
    D:/Card.astro:32:1
```

Line 32 is a normal element tag, and the issue is with the type declaration above. Just change it to:

```typescript
import type { BlogCollectionEntry } from "../types";

type PropsType = { variant?: "h2" | "h3"; } & BlogCollectionEntry

export type Props = PropsType

const { variant = "h2", data, id, filePath } = Astro.props;
```
