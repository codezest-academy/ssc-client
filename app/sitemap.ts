import { MetadataRoute } from 'next'
import { api } from '@/lib/axios'

interface Subject {
  slug: string;
}

interface Chapter {
  id: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://codezest-ssc.com'

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pyq`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  try {
    // Fetch subjects
    const subjectsResponse = await api.get('/subjects');
    const subjects: Subject[] = subjectsResponse.data.data;

    const dynamicRoutes = await Promise.all(
      subjects.map(async (subject) => {
        // Add subject page
        const subRoute = {
          url: `${baseUrl}/pyq/${subject.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };

        // Fetch chapters for this subject
        try {
          const chaptersResponse = await api.get(`/chapters/subject/${subject.slug}`);
          const chapters: Chapter[] = chaptersResponse.data.data;

          const chapterRoutes = chapters.map((chapter) => ({
            url: `${baseUrl}/pyq/${subject.slug}/${chapter.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          }));

          return [subRoute, ...chapterRoutes];
        } catch (error) {
          console.error(`Failed to fetch chapters for sitemap: ${subject.slug}`, error);
          return [subRoute];
        }
      })
    );

    return [...routes, ...dynamicRoutes.flat()];
  } catch (error) {
    console.error('Failed to fetch dynamic routes for sitemap', error);
    return routes;
  }
}
