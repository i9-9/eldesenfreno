import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "app/posts");

interface PostData {
  title: string;
  date: string;
  [key: string]: any; // Allows additional frontmatter properties
}

interface Post {
  slug: string;
  content: string;
  data: PostData;
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDir);

  return fileNames
    .filter((fileName) => {
      // Only process .md files
      if (!fileName.endsWith('.md')) return false;
      
      try {
        const filePath = path.join(postsDir, fileName);
        return fs.statSync(filePath).isFile();
      } catch (error) {
        console.warn(`Error checking file ${fileName}:`, error);
        return false;
      }
    })
    .map((fileName) => {
      try {
        const slug = fileName.replace(/\.md$/, "");
        const filePath = path.join(postsDir, fileName);
        const fileContents = fs.readFileSync(filePath, "utf8");

        const { content, data } = matter(fileContents);
        
        // Validate required fields
        if (!data.title || !data.date) {
          throw new Error(`Missing required frontmatter in ${fileName}`);
        }

        return { 
          slug, 
          content, 
          data: data as PostData 
        };
      } catch (error) {
        console.error(`Error processing file ${fileName}:`, error);
        // Return a null or skip this file, depending on your needs
        throw error;
      }
    });
}
