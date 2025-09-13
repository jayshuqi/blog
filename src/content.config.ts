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
