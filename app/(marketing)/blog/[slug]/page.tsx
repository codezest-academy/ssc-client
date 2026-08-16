"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import Markdown from "markdown-to-jsx";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  slug: string;
  contentMd: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  createdAt: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
  };
}

export default function ArticlePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${slug}`);
        setArticle(res.data);
        
        // Update document title dynamically
        if (res.data.metaTitle) {
          document.title = `${res.data.metaTitle} | SSC Platform`;
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <section className="bg-muted/30 py-20 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-6 w-32 bg-muted rounded-full mb-8"></div>
              <div className="h-12 w-3/4 bg-muted rounded-xl"></div>
              <div className="h-12 w-1/2 bg-muted rounded-xl"></div>
              <div className="h-6 w-48 bg-muted rounded-full mt-6"></div>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 max-w-4xl py-12 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-4 bg-muted rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push('/blog')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(article.title);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        // Could add a toast here for "Link copied!"
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Article Header */}
      <section className="bg-muted/30 pt-16 pb-12 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to all articles
          </Link>
          
          {article.category && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <Tag className="w-3 h-3" />
                {article.category.name}
              </span>
            </div>
          )}
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-8">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-border/50 pt-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase shrink-0">
                {article.author?.name?.charAt(0) || "C"}
              </div>
              <span className="font-medium text-foreground">{article.author?.name || "Code Zest Team"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(article.publishedAt || article.createdAt), "MMMM d, yyyy")}</span>
            </div>
            
            {/* Share Dropdown/Buttons */}
            <div className="flex items-center gap-3 ml-auto">
              <span className="font-medium flex items-center gap-1"><Share2 className="w-4 h-4" /> Share</span>
              <button onClick={() => handleShare('twitter')} className="p-2 hover:bg-muted rounded-full transition-colors font-medium">X</button>
              <button onClick={() => handleShare('facebook')} className="p-2 hover:bg-muted rounded-full transition-colors font-medium">FB</button>
              <button onClick={() => handleShare('linkedin')} className="p-2 hover:bg-muted rounded-full transition-colors font-medium">IN</button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="container mx-auto px-4 max-w-3xl py-12 md:py-16">
        <article className="prose prose-slate dark:prose-invert md:prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <Markdown>
            {article.contentMd || ""}
          </Markdown>
        </article>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto px-4 max-w-3xl py-12 border-t border-border mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to start preparing?</h2>
        <p className="text-muted-foreground mb-8">Join thousands of students and start your journey towards success.</p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => router.push('/register')}>Sign Up Now</Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/pricing')}>View Plans</Button>
        </div>
      </section>
    </div>
  );
}
