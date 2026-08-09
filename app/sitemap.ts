import { MetadataRoute } from 'next'


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
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000/api/v1';
    
    // Fetch subjects
    const subjectsResponse = await fetch(`${apiUrl}/subjects`).then(res => res.json());
    const subjects: Subject[] = subjectsResponse?.data || [];

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
          const chaptersResponse = await fetch(`${apiUrl}/chapters/subject/${subject.slug}`).then(res => res.json());
          const chapters: Chapter[] = chaptersResponse?.data || [];

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
