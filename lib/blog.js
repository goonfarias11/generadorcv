import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_PATH = path.join(process.cwd(), 'content/blog');

export function getAllPosts() {
  const files = fs.readdirSync(BLOG_PATH);

  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(BLOG_PATH, file);
      const source = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(source);

      return {
        slug: file.replace('.mdx', ''),
        frontmatter: data,
        content,
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB - dateA; // Más reciente primero
    });

  return posts;
}

export function getPostBySlug(slug) {
  const filePath = path.join(BLOG_PATH, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);

  return {
    slug,
    frontmatter: data,
    content,
  };
}

export function getPostsByCategory(category) {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.frontmatter.category === category);
}

export function getPostsByTag(tag) {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => 
    post.frontmatter.tags?.includes(tag)
  );
}

export function getAllCategories() {
  const allPosts = getAllPosts();
  const categories = new Set(allPosts.map((post) => post.frontmatter.category));
  return Array.from(categories);
}

export function getAllTags() {
  const allPosts = getAllPosts();
  const tags = new Set(allPosts.flatMap((post) => post.frontmatter.tags || []));
  return Array.from(tags);
}
