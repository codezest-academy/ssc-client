"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  publishedAt: string;
  createdAt: string;
  category: Category;
  isPublished?: boolean;
  author: {
    name: string;
  };
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          api.get("/articles"),
          api.get("/categories"),
        ]);
        
        // API returns { data: { data: [...] } } — unwrap the envelope
        const articlesData: Article[] = Array.isArray(articlesRes.data?.data)
          ? articlesRes.data.data
          : Array.isArray(articlesRes.data)
          ? articlesRes.data
          : [];

        const categoriesData: Category[] = Array.isArray(categoriesRes.data?.data)
          ? categoriesRes.data.data
          : Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : [];

        // Filter only published articles for the blog
        const publishedArticles = articlesData.filter((a) => a.isPublished ?? true);
        setArticles(publishedArticles);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArticles = activeCategory === "all" 
    ? articles 
    : articles.filter(a => a.category?.slug === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="bg-muted/30 py-20 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Insights & Updates
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover the latest strategies, syllabus updates, and preparation tips for SSC exams from our expert team.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 max-w-6xl py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-2xl h-[300px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveCategory("all")}
              >
                All Posts
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.slug ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setActiveCategory(cat.slug)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">Check back later for new content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <Link href={`/blog/${article.slug}`} key={article.id} className="group flex flex-col h-full bg-card rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="p-6 md:p-8 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-4">
                        {article.category && (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Tag className="w-3 h-3" />
                            {article.category.name}
                          </span>
                        )}
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 ml-auto">
                          <Clock className="w-3 h-3" />
                          {format(new Date(article.publishedAt || article.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm md:text-base">
                        {article.metaDescription || "Read this article to learn more about our latest updates and strategies."}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                        <span className="text-sm font-medium text-foreground">
                          {article.author?.name || "Code Zest Team"}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <ArrowRight className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
