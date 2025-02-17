import BlogCard from '@/components/NewsCard';

const fakePosts = [
  { name: 'career-tips', title: 'Top Career Tips', category: 'Career', excerpt: 'Improve your career prospects with these tips...' },
  { name: 'event-highlights', title: 'Event Highlights', category: 'Events', excerpt: 'A recap of our recent events...' }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Latest News & Blog</h2>
      <div className="space-y-4">
        {fakePosts.map(post => (
          <BlogCard key={post.name} post={post} />
        ))}
      </div>
    </div>
  );
}
