import type { CollectionEntry } from "astro:content";

export type BlogCollectionEntry = CollectionEntry<"blog"> | CollectionEntry<"enBlog"> | CollectionEntry<"zhBlog">
