import { notFound } from "next/navigation";
import { getAllPosts } from "../../lib/posts";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

async function fetchPosts(slug) {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export default async function Post({ params }) {
  const post = await fetchPosts(params.slug);

  if (!post) notFound();

  const htmlConverter = md.render(post.content);

  return (
    <article className="font-neue-haas-grotesk">
      <h1>{post.data.title}</h1>
      <p>{post.data.date}</p>
      <div dangerouslySetInnerHTML={{ __html: htmlConverter }} />
    </article>
  );
}
