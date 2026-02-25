import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    title: "The Clinical Power of Papaya Seed Extract",
    excerpt:
      "New studies reveal the significant impact of papaya seeds on gut health and anti-inflammatory pathways.",
    image:
      "https://images.unsplash.com/photo-1596541249704-54fd0c326cfd?q=80&w=1000&auto=format&fit=crop",
    date: "Jan 12, 2026",
  },
  {
    title: "Modern Science Meets Ancient Elderberry",
    excerpt:
      "How clinical-grade elderberry extractions are redefining seasonal immunity protocols in modern clinics.",
    image:
      "https://images.unsplash.com/photo-1622484211148-7bf331d27993?q=80&w=1000&auto=format&fit=crop",
    date: "Jan 08, 2026",
  },
  {
    title: "Ashwagandha: A Specialist's Perspective",
    excerpt:
      "Dr. Simeon breaks down the neuro-protective properties of high-concentration withanolides.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
    date: "Jan 02, 2026",
  },
];

export function BlogPosts() {
  return (
    <section className="px-6 py-24 lg:px-12 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase text-[#f2c94c] tracking-tight">
              Clinical Journal
            </p>
            <h2 className="text-4xl font-black text-black tracking-tight">
              Herbal Insights
            </h2>
            <p className="text-gray-500 max-w-xl font-medium">
              Explore our latest research on botanical extracts, clinical
              trials, and natural wellness protocols.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase text-white shadow-lg hover:shadow-primary/30 transition-all hover:scale-105"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post, i) => (
            <article key={i} className="group cursor-pointer">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-6 transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-[10px] font-bold text-[#f2c94c] uppercase mb-2">
                {post.date}
              </p>
              <h3 className="text-xl font-bold text-black mb-3 group-hover:text-primary transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 font-medium leading-relaxed">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
