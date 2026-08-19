"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, BookOpen, Clock, Tag, Search, Mail } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState("");

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
        
        // Sort by publishedAt (descending) so newest is first
        const sortedArticles = publishedArticles.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt).getTime();
          const dateB = new Date(b.publishedAt || b.createdAt).getTime();
          return dateB - dateA;
        });

        setArticles(sortedArticles);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArticles = articles.filter(a => {
    const matchesCategory = activeCategory === "all" || a.category?.slug === activeCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (a.metaDescription || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const remainingArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Premium Ambient Hero Section */}
      <section className="relative py-24 border-b border-border bg-ambient-indigo bg-grid-pattern overflow-hidden">
        {/* Glass edge highlight on top */}
        <div className="absolute inset-x-0 top-0 h-px bg-glass-edge" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            {/* Hero Text & Search */}
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Latest Updates & Exam Guidance
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  Discover high-impact blogs for your preparation
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Notifications, admit card updates, exam analysis, current affairs, and preparation strategies in one place.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-lg">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input 
                  type="text" 
                  placeholder="Search blogs, topics or exams..." 
                  className="pl-12 pr-4 py-6 text-lg rounded-2xl bg-card border-border/80 shadow-sm focus-visible:ring-primary focus-visible:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Featured Article Card (if exists) */}
            {featuredArticle && !loading && (
              <div className="flex-1 w-full max-w-xl lg:max-w-none">
                <Link href={`/blog/${featuredArticle.slug}`} className="group block bg-card rounded-[2rem] border border-border/80 overflow-hidden shadow-floating transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-80 z-10" />
                  
                  {/* Decorative background for the featured card since we don't have images yet */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  
                  <div className="relative z-20 p-8 md:p-12 flex flex-col h-[400px] justify-end">
                    <div className="flex items-center gap-3 mb-6">
                      {featuredArticle.category && (
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 flex items-center gap-1.5 backdrop-blur-sm">
                          <Tag className="w-4 h-4" />
                          {featuredArticle.category.name}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {featuredArticle.title}
                    </h3>
                    
                    <div className="flex items-center gap-6 text-muted-foreground font-medium">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {format(new Date(featuredArticle.publishedAt || featuredArticle.createdAt), "MMMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                          {featuredArticle.author?.name?.charAt(0) || "C"}
                        </div>
                        {featuredArticle.author?.name || "Code Zest Team"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Articles Grid (2/3 width) */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-2xl font-bold border-b border-border pb-4">Recent Articles</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-muted rounded-3xl h-[350px]" />
                ))}
              </div>
            ) : remainingArticles.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No more articles found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {remainingArticles.map((article) => (
                  <Link href={`/blog/${article.slug}`} key={article.id} className="group flex flex-col h-full bg-card rounded-3xl border border-border/80 overflow-hidden hover:shadow-floating transition-all duration-300 hover:-translate-y-1">
                    <div className="p-6 md:p-8 flex flex-col h-full relative">
                      {/* Subtle hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-5">
                          {article.category && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10 flex items-center gap-1.5">
                              <Tag className="w-3 h-3" />
                              {article.category.name}
                            </span>
                          )}
                          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 ml-auto">
                            <Clock className="w-3 h-3" />
                            {format(new Date(article.publishedAt || article.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm md:text-base leading-relaxed">
                          {article.metaDescription || "Read this article to learn more about our latest updates and strategies for your exams."}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-5 border-t border-border/50">
                          <span className="text-sm font-medium text-foreground flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px]">
                              {article.author?.name?.charAt(0) || "C"}
                            </div>
                            {article.author?.name || "Code Zest Team"}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                            <ArrowRight className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar (1/3 width) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Categories Widget */}
            <div className="bg-card rounded-3xl border border-border/80 p-6 md:p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Explore Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeCategory === "all" ? "default" : "outline"}
                  className="rounded-full font-medium"
                  size="sm"
                  onClick={() => setActiveCategory("all")}
                >
                  All Posts
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.slug ? "default" : "outline"}
                    className="rounded-full font-medium"
                    size="sm"
                    onClick={() => setActiveCategory(cat.slug)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-ambient-indigo bg-card rounded-3xl border border-primary/20 p-6 md:p-8 relative overflow-hidden">
              <div className="relative z-10 space-y-4 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2 text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Get the latest exam notifications and study materials delivered directly to your inbox.
                </p>
                <div className="pt-2 flex flex-col gap-3">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="rounded-xl bg-background/50 backdrop-blur-sm border-border/50 text-center"
                  />
                  <Button className="w-full rounded-xl shadow-floating hover:shadow-none transition-shadow">
                    Subscribe Now
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
