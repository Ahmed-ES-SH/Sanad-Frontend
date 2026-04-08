export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
  featured?: boolean;
}

// Sample data - 20 articles
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Essential Tips for Designing a Memorable Brand Logo",
    excerpt:
      "Creating a memorable brand logo requires understanding your audience, choosing the right colors, and ensuring scalability across all platforms.",
    author: "John Smith",
    date: "December 15, 2022",
    readTime: "5 min read",
    category: "Design and Branding",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    tags: ["branding", "design", "logo"],
    featured: true,
  },
  {
    id: 2,
    title: "The Dos and Don'ts of Social Media Marketing in 2022",
    excerpt:
      "Social media marketing continues to evolve. Learn the essential strategies that work and common mistakes to avoid in today's digital landscape.",
    author: "Sarah Johnson",
    date: "December 10, 2022",
    readTime: "7 min read",
    category: "Marketing Strategy",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    tags: ["social media", "marketing", "strategy"],
  },
  {
    id: 3,
    title:
      "The Power of Video Marketing: How Animated Explainer Videos Can Boost Engagement",
    excerpt:
      "Discover how animated explainer videos can transform your marketing strategy and significantly increase audience engagement rates.",
    author: "Lisa Chen",
    date: "November 20, 2022",
    readTime: "6 min read",
    category: "Video Production",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
    tags: ["video", "animation", "marketing"],
  },
  {
    id: 4,
    title:
      "Designing for Accessibility: Tips and Best Practices for Inclusive Design",
    excerpt:
      "Learn how to create designs that are accessible to everyone, including users with disabilities, while maintaining aesthetic appeal.",
    author: "Alex Rivera",
    date: "November 5, 2022",
    readTime: "8 min read",
    category: "Design and Branding",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop",
    tags: ["accessibility", "ui design", "inclusive design"],
  },
  {
    id: 5,
    title: "The Rise of Digital Trends: What's Next for 2023",
    excerpt:
      "Explore the emerging digital trends that will shape the technology landscape in 2023 and beyond.",
    author: "Mike Thompson",
    date: "March 2, 2023",
    readTime: "4 min read",
    category: "App Development",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    tags: ["trends", "technology", "digital transformation"],
  },
  {
    id: 6,
    title: "Storytelling in Marketing: Creating Emotional Connections",
    excerpt:
      "Learn how powerful storytelling can create deeper emotional connections with your audience and drive better marketing results.",
    author: "Emma Davis",
    date: "February 8, 2023",
    readTime: "5 min read",
    category: "Marketing Strategy",
    image:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["storytelling", "content marketing", "brand strategy"],
  },
  {
    id: 7,
    title: "Mobile-First Design: Creating Responsive User Experiences",
    excerpt:
      "Understanding the importance of mobile-first design principles and how to create seamless experiences across all devices.",
    author: "David Kim",
    date: "January 25, 2023",
    readTime: "6 min read",
    category: "Website Development",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    tags: ["mobile design", "responsive", "ux"],
  },
  {
    id: 8,
    title: "Color Psychology in Web Design: Influencing User Behavior",
    excerpt:
      "Discover how different colors can impact user emotions and behavior, and learn to use color psychology effectively in your designs.",
    author: "Maria Rodriguez",
    date: "January 18, 2023",
    readTime: "7 min read",
    category: "Design and Branding",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
    tags: ["color psychology", "web design", "user behavior"],
  },
  {
    id: 9,
    title: "Building Progressive Web Apps: The Future of Mobile Development",
    excerpt:
      "Learn how PWAs combine the best of web and native mobile apps to deliver superior user experiences.",
    author: "James Wilson",
    date: "January 12, 2023",
    readTime: "9 min read",
    category: "App Development",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    tags: ["pwa", "mobile development", "web apps"],
  },
  {
    id: 10,
    title: "SEO Strategies That Actually Work in 2023",
    excerpt:
      "Cut through the noise and discover the SEO tactics that are delivering real results in today's search landscape.",
    author: "Rachel Green",
    date: "January 5, 2023",
    readTime: "8 min read",
    category: "Marketing Strategy",
    image:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop",
    tags: ["seo", "search marketing", "digital strategy"],
  },
  {
    id: 11,
    title: "The Art of Minimalist Design: Less is More",
    excerpt:
      "Explore the principles of minimalist design and how simplicity can create more impactful and user-friendly interfaces.",
    author: "Oliver Chen",
    date: "December 28, 2022",
    readTime: "5 min read",
    category: "Design and Branding",
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop",
    tags: ["minimalism", "design principles", "ui design"],
  },
  {
    id: 12,
    title: "Content Marketing Automation: Tools and Strategies",
    excerpt:
      "Streamline your content marketing efforts with automation tools and strategies that save time while improving results.",
    author: "Sophie Turner",
    date: "December 20, 2022",
    readTime: "6 min read",
    category: "Marketing Strategy",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    tags: ["content marketing", "automation", "marketing tools"],
  },
  {
    id: 13,
    title: "JavaScript Frameworks Comparison: React vs Vue vs Angular",
    excerpt:
      "A comprehensive comparison of the most popular JavaScript frameworks to help you choose the right one for your project.",
    author: "Kevin Park",
    date: "December 12, 2022",
    readTime: "10 min read",
    category: "Website Development",
    image:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop",
    tags: ["javascript", "frameworks", "web development"],
  },
  {
    id: 14,
    title: "User Experience Research: Methods and Best Practices",
    excerpt:
      "Learn effective UX research methods to better understand your users and create more successful digital products.",
    author: "Amanda Foster",
    date: "December 8, 2022",
    readTime: "7 min read",
    category: "Design and Branding",
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    tags: ["ux research", "user testing", "design thinking"],
  },
  {
    id: 15,
    title: "Building Scalable APIs: Architecture and Best Practices",
    excerpt:
      "Design and implement APIs that can handle growth while maintaining performance and reliability.",
    author: "Tom Anderson",
    date: "November 30, 2022",
    readTime: "9 min read",
    category: "App Development",
    image:
      "https://images.unsplash.com/photo-1702024145550-8e13d8861b72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["api design", "backend", "scalability"],
  },
  {
    id: 16,
    title: "Social Media Analytics: Measuring What Matters",
    excerpt:
      "Beyond vanity metrics: learn to track and analyze social media data that actually impacts your business goals.",
    author: "Nina Patel",
    date: "November 25, 2022",
    readTime: "6 min read",
    category: "Social Media",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    tags: ["analytics", "social media", "metrics"],
  },
  {
    id: 17,
    title: "Typography in Digital Design: Creating Visual Hierarchy",
    excerpt:
      "Master the art of typography to improve readability and create compelling visual hierarchies in your digital designs.",
    author: "Lucas Miller",
    date: "November 18, 2022",
    readTime: "5 min read",
    category: "Design and Branding",
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    tags: ["typography", "visual hierarchy", "design"],
  },
  {
    id: 18,
    title: "Cloud Computing for Small Business: Getting Started",
    excerpt:
      "A beginner's guide to adopting cloud computing solutions that can help small businesses scale efficiently.",
    author: "Carol White",
    date: "November 10, 2022",
    readTime: "8 min read",
    category: "App Development",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    tags: ["cloud computing", "small business", "technology"],
  },
  {
    id: 19,
    title: "Email Marketing Automation: Strategies That Convert",
    excerpt:
      "Build email marketing funnels that nurture leads and convert subscribers into customers through strategic automation.",
    author: "Robert Lee",
    date: "November 3, 2022",
    readTime: "7 min read",
    category: "Marketing Strategy",
    image:
      "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["email marketing", "automation", "conversion"],
  },
  {
    id: 20,
    title: "The Future of Web Development: Emerging Technologies",
    excerpt:
      "Explore the cutting-edge technologies that are shaping the future of web development and what developers need to know.",
    author: "Grace Kim",
    date: "October 28, 2022",
    readTime: "6 min read",
    category: "Website Development",
    image:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop",
    tags: ["future tech", "web development", "emerging technologies"],
  },
];

export const categories = [
  {
    name: { en: "Design and Branding", ar: "التصميم والعلامة التجارية" },
    count: 6,
  },
  { name: { en: "Website Development", ar: "تطوير المواقع" }, count: 4 },
  { name: { en: "App Development", ar: "تطوير التطبيقات" }, count: 4 },
  { name: { en: "Social Media", ar: "وسائل التواصل الاجتماعي" }, count: 1 },
  { name: { en: "Marketing Strategy", ar: "استراتيجية التسويق" }, count: 5 },
  { name: { en: "Video Production", ar: "إنتاج الفيديو" }, count: 1 },
];
