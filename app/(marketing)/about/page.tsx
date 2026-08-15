import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Code Zest Academy and our mission to empower students for government jobs.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight mb-8">About Code Zest Academy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>
            Welcome to Code Zest Academy. We are on a mission to empower students and aspirants across India to achieve their government job dreams through high-quality, accessible, and AI-driven education.
          </p>
          <h2>Our Vision</h2>
          <p>
            To become the most trusted and effective preparation platform for SSC, Banking, and other competitive exams by leveraging technology to provide personalized learning paths.
          </p>
          <h2>Why We Started</h2>
          <p>
            We realized that many aspirants waste months or even years studying the wrong way. They practice indiscriminately without diagnosing their exact weaknesses. Code Zest was built to solve this—acting as a personal AI tutor that identifies your weak spots and guides you precisely to where you need to focus.
          </p>
          <h2>Our Team</h2>
          <p>
            We are a team of educators, technologists, and former rank-holders dedicated to bringing you the best curriculum, video solutions, and mock tests in the industry.
          </p>
        </div>
      </div>
    </div>
  );
}
