/* eslint-disable @typescript-eslint/no-unused-vars */
interface Params {
    name: string;
  }
  
  const dummyPost = {
    name: 'career-tips',
    title: 'Top Career Tips',
    category: 'Career',
    content: 'Detailed content about career tips goes here...'
  };
  
  export default function BlogPostPage() {
    const post = dummyPost;
    return (
      <div className="min-h-screen">
        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
        <p className="text-gray-600 mb-6">{post.category}</p>
        <div className="prose dark:prose-dark">{post.content}</div>
      </div>
    );
  }
  