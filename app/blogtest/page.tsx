import { getAllPosts } from "../lib/posts";
import Link from "next/link.js";

export default function Blogtest() {
    const posts = getAllPosts();
    return (
        <div className="font-neue-haas-grotesk">
            <h2 className="font-bold">Blog</h2>
            <ul>
                {" "}
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link href={`/posts/${post.slug}`}>{post.data.title}</Link>
                        <p>{post.data.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}