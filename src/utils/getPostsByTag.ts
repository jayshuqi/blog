import getSortedPosts from "./getSortedPosts";
import { slugifyAll } from "./slugify";
import type { BlogCollectionEntry } from "@/types";

const getPostsByTag = (posts: BlogCollectionEntry[], tag: string) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
  );

export default getPostsByTag;
