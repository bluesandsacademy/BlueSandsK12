import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "blog-posts.json");

export async function getPosts() {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function savePosts(posts) {
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
}

export async function getPostById(id) {
  const posts = await getPosts();
  return posts.find((p) => p.id === id) || null;
}

export async function createPost(data) {
  const posts = await getPosts();
  const now = new Date();
  const newPost = {
    id: `post-${Date.now()}`,
    ...data,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  posts.unshift(newPost);
  await savePosts(posts);
  return newPost;
}

export async function updatePost(id, data) {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  posts[index] = { ...posts[index], ...data, updatedAt: new Date().toISOString() };
  await savePosts(posts);
  return posts[index];
}

export async function deletePost(id) {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  posts.splice(index, 1);
  await savePosts(posts);
  return true;
}
