"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface Testimonial {
  id: string;
  message: string;
  user: {
    name: string;
  };
  createdAt: string;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/feedback/public-testimonials");
        setTestimonials(res.data.data);
      } catch (e) {
        console.error("Failed to fetch testimonials", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What Our Students Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Real success stories from aspirants just like you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-card border rounded-3xl p-8 shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                {"★".repeat(5)}
              </div>
              <p className="text-muted-foreground leading-relaxed italic mb-6">
                "{t.message}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                  {t.user.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.user.name}</div>
                  <div className="text-xs text-muted-foreground">SSC Aspirant</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
