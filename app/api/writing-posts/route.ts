import { NextResponse } from "next/server";
import { getSubstackPosts } from "@/lib/substack";

export async function GET() {
  const posts = await getSubstackPosts();
  return NextResponse.json(posts);
}
