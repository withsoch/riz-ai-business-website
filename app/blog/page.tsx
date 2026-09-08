import { getSubstackPosts } from "@/lib/substack";
import BlogClient from "./BlogClient";

export default async function Blog() {
  const posts = await getSubstackPosts();
  return <BlogClient posts={posts} />;
}
