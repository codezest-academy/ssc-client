import { MetadataRoute } from 'next';
import { api } from '@/lib/axios';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // In a real application, you would fetch the list of all available PYQ papers from your backend.
  // We'll mock a few routes for demonstration of the programmatic SEO infrastructure.
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ssccgl.example.com';
  
  // Mock data representing available papers
  const papers = [
    { examSlug: 'ssc-cgl', year: '2023', shift: 'shift-1', subject: 'maths' },
    { examSlug: 'ssc-cgl', year: '2023', shift: 'shift-1', subject: 'english' },
    { examSlug: 'ssc-cgl', year: '2023', shift: 'shift-2', subject: 'maths' },
    { examSlug: 'ssc-chsl', year: '2022', shift: 'shift-3', subject: 'reasoning' },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = papers.map((paper) => ({
    url: `${baseUrl}/pyq/papers/${paper.examSlug}/${paper.year}/${paper.shift}/${paper.subject}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Also include the main PYQ landing page
  sitemapEntries.unshift({
    url: `${baseUrl}/pyq`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  });

  return sitemapEntries;
}
