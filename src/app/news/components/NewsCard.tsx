import Link from 'next/link';

interface NewsPost {
    name: string;
    title: string;
    category: string;
    excerpt: string;
}

interface NewsCardProps {
    post: NewsPost;
}

export default function NewsCard({post}: NewsCardProps) {
    return (
        <div className="border p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-2">{post.category}</p>
            <p className="mb-4">{post.excerpt}</p>
            <Link href={`/blog/${post.name}`} className="text-blue-500 hover:underline">
                Read More
            </Link>
        </div>
    );
}
