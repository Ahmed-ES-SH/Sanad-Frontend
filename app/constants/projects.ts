/**
 * Extended Project Data Model for Portfolio Pages
 * 
 * New fields added:
 * - tagline: Brief punchline for the project
 * - client: Client name
 * - year: Project year
 * - duration: Project duration
 * - coverImage: High-res cover image URL
 * - gallery: Array of gallery images
 * - challenge: The problem/challenge description
 * - solution: The solution description  
 * - results: Key metrics/results
 * - tools: Tools and technologies used (enhanced from skills)
 * - process: Array of process phases
 * - team: Team credits
 * - relatedProjects: IDs of related projects
 * - liveUrl: Live project URL
 * - caseStudyUrl: Case study document URL
 */

export interface ProjectProcessPhase {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
}

export interface ProjectResult {
  value: string;
  label: { en: string; ar: string };
  icon: string;
}

export interface ProjectData {
  id: number;
  // Basic info (existing)
  imgSrc: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  category: { en: string; ar: string };
  skills: string[];
  
  // New extended fields
  tagline?: { en: string; ar: string };
  client?: { en: string; ar: string };
  year?: string;
  duration?: { en: string; ar: string };
  coverImage?: string;
  gallery?: string[];
  challenge?: {
    en: string;
    ar: string;
  };
  solution?: {
    en: string;
    ar: string;
  };
  results?: ProjectResult[];
  tools?: string[];
  process?: ProjectProcessPhase[];
  team?: { en: string; ar: string };
  relatedProjects?: number[];
  liveUrl?: string;
  caseStudyUrl?: string;
}

export const projectsData: ProjectData[] = [
  {
    id: 1,
    imgSrc: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
    ],
    title: { en: "E-Commerce Platform", ar: "منصة تجارة إلكترونية" },
    tagline: { en: "A seamless shopping experience with integrated payments", ar: "تجربة تسوق سلسة مع أنظمة دفع مدمجة" },
    description: {
      en: "An online store built to deliver a seamless shopping experience with integrated payment and inventory systems.",
      ar: "متجر إلكتروني يقدم تجربة تسوق سلسة مع أنظمة دفع ومخزون مدمجة.",
    },
    category: { en: "Web Development", ar: "تطوير الويب" },
    client: { en: "RetailCo", ar: "ريتايلكو" },
    year: "2024",
    duration: { en: "4 months", ar: "4 أشهر" },
    skills: ["React", "Node.js", "MongoDB", "Stripe API"],
    tools: ["React", "Node.js", "MongoDB", "Stripe", "AWS", "Redis"],
    challenge: {
      en: "The client needed a scalable e-commerce platform that could handle high traffic during peak seasons while maintaining fast load times and a seamless checkout experience.",
      ar: "احتاج العميل إلى منصة تجارة إلكترونية قابلة للتوسع قادرة على التعامل مع حركة المرور العالية خلال مواسم الذمع مع الحفاظ على سرعة التحميل وتجربة دفع سلسة.",
    },
    solution: {
      en: "Built a microservices architecture with React frontend, Node.js backend, and MongoDB database. Implemented caching with Redis and Stripe integration for secure payments.",
      ar: "تم بناء بنية خدمات مصغرة باستخدام React للواجهة و Node.js للخادم و MongoDB لقاعدة البيانات. تم تنفيذ التخزين المؤقت مع Redis وتكامل Stripe للمدفوعات الآمنة.",
    },
    results: [
      { value: "3x", label: { en: "Conversion Rate", ar: "معدل التحويل" }, icon: "chart" },
      { value: "<1s", label: { en: "Page Load Time", ar: "وقت التحميل" }, icon: "zap" },
      { value: "99.9%", label: { en: "Uptime", ar: "وقت التشغيل" }, icon: "check" },
      { value: "50K+", label: { en: "Monthly Users", ar: "مستخدمين شهرياً" }, icon: "users" },
    ],
    process: [
      { title: { en: "Discovery", ar: "الاكتشاف" }, description: { en: "Requirements gathering and market research", ar: "جمع المتطلبات وأبحاث السوق" } },
      { title: { en: "Design", ar: "التصميم" }, description: { en: "UI/UX design and prototyping", ar: "تصميم الواجهة والتجربة والنماذج الأولية" } },
      { title: { en: "Development", ar: "التطوير" }, description: { en: "Full-stack implementation", ar: "تنفيذ كامل المكدس" } },
      { title: { en: "Launch", ar: "الإطلاق" }, description: { en: "Deployment and optimization", ar: "النشر والتحسين" } },
    ],
    team: { en: "5 developers, 2 designers", ar: "5 مطورين، 2 مصممين" },
    liveUrl: "https://example.com",
    relatedProjects: [2, 5],
  },
  {
    id: 2,
    imgSrc: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200",
    ],
    title: { en: "Brand Identity Design", ar: "تصميم الهوية البصرية" },
    tagline: { en: "Complete visual identity for a tech startup", ar: "هوية بصرية كاملة لشركة تقنية ناشئة" },
    description: {
      en: "We created a complete brand identity including logo, typography, and visual assets for a startup.",
      ar: "قمنا بإنشاء هوية بصرية كاملة تشمل الشعار والخطوط والعناصر البصرية لشركة ناشئة.",
    },
    category: { en: "Graphic Design", ar: "التصميم الجرافيكي" },
    client: { en: "TechVenture", ar: "تك فنتشر" },
    year: "2024",
    duration: { en: "2 months", ar: "شهران" },
    skills: ["Illustrator", "Photoshop", "Figma"],
    tools: ["Illustrator", "Photoshop", "Figma", "After Effects"],
    challenge: {
      en: "A new tech startup needed a distinctive visual identity that would set them apart in a crowded market and communicate their innovative approach.",
      ar: "احتاجت شركة تقنية ناشئة جديدة إلى هوية بصرية مميزة تميزها في سوق مزدحم وتتواصل مع نهجها المبتكر.",
    },
    solution: {
      en: "Created a bold, modern brand system with custom logo, color palette, typography, and comprehensive brand guidelines.",
      ar: "تم إنشاء نظام علامة تجارية جريء وحديث مع شعار مخصص ولوحة ألوان وخطوط وإرشادات شاملة للعلامة التجارية.",
    },
    results: [
      { value: "100%", label: { en: "Brand Recognition", ar: "الوعي بالعلامة" }, icon: "star" },
      { value: "40%", label: { en: "Increase in Leads", ar: "زيادة في العملاء" }, icon: "users" },
    ],
    relatedProjects: [1, 3],
  },
  {
    id: 3,
    imgSrc: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200",
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1200",
    ],
    title: { en: "Social Media Campaign", ar: "حملة تسويقية عبر التواصل الاجتماعي" },
    tagline: { en: "Month-long campaign driving brand awareness", ar: "حملة شهرية تزيد الوعي بالعلامة التجارية" },
    description: {
      en: "Managed and executed a month-long social media campaign for a retail brand.",
      ar: "قمنا بإدارة وتنفيذ حملة تسويق شهرية عبر وسائل التواصل لعلامة تجارية تجزئة.",
    },
    category: { en: "Digital Marketing", ar: "التسويق الرقمي" },
    client: { en: "FashionHouse", ar: "هاوس فاشن" },
    year: "2024",
    duration: { en: "1 month", ar: "شهر واحد" },
    skills: ["Meta Ads", "Instagram", "Analytics"],
    tools: ["Meta Business", "Instagram", "Google Analytics", "HubSpot"],
    results: [
      { value: "5M+", label: { en: "Impressions", ar: "مرات الظهور" }, icon: "eye" },
      { value: "180%", label: { en: "Engagement Rate", ar: "معدل التفاعل" }, icon: "heart" },
      { value: "3x", label: { en: "ROAS", ar: "العائد على الإنفاق" }, icon: "dollar" },
    ],
    relatedProjects: [6],
  },
  {
    id: 4,
    imgSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200",
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200",
    ],
    title: { en: "Mobile Delivery App", ar: "تطبيق توصيل موبايل" },
    tagline: { en: "Real-time food delivery with tracking", ar: "توصيل طعام بالتتبع اللحظي" },
    description: {
      en: "Developed a mobile application for food delivery with real-time tracking and online payments.",
      ar: "طورنا تطبيق موبايل لتوصيل الطعام مع تتبع لحظي وخيارات دفع إلكترونية.",
    },
    category: { en: "Mobile Development", ar: "تطوير التطبيقات" },
    client: { en: "FoodExpress", ar: "فود إكسبريس" },
    year: "2023",
    duration: { en: "6 months", ar: "6 أشهر" },
    skills: ["React Native", "Firebase", "Google Maps API"],
    tools: ["React Native", "Firebase", "Google Maps", "Stripe"],
    results: [
      { value: "100K+", label: { en: "Downloads", ar: "التنزيلات" }, icon: "download" },
      { value: "4.8★", label: { en: "App Rating", ar: "تقييم التطبيق" }, icon: "star" },
    ],
    relatedProjects: [1],
  },
  {
    id: 5,
    imgSrc: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
    ],
    title: { en: "Corporate Website", ar: "موقع شركة رسمي" },
    tagline: { en: "Multilingual corporate presence", ar: "حضور مؤسسي متعدد اللغات" },
    description: {
      en: "Designed and developed a multilingual corporate website for a consulting firm.",
      ar: "صممنا وطوّرنا موقعًا رسميًا متعدد اللغات لشركة استشارية.",
    },
    category: { en: "Web Development", ar: "تطوير الويب" },
    client: { en: "ConsultPro", ar: "كونسلت برو" },
    year: "2023",
    duration: { en: "3 months", ar: "3 أشهر" },
    skills: ["Next.js", "Tailwind CSS", "i18n"],
    tools: ["Next.js", "Tailwind", "i18next", "Vercel"],
    results: [
      { value: "60%", label: { en: "Traffic Increase", ar: "زيادة الحركة" }, icon: "chart" },
      { value: "40%", label: { en: "Lead Increase", ar: "زيادة العملاء" }, icon: "users" },
    ],
    relatedProjects: [1, 2],
  },
  {
    id: 6,
    imgSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
    ],
    title: { en: "Marketing Strategy Plan", ar: "خطة استراتيجية تسويقية" },
    tagline: { en: "Data-driven marketing for product launch", ar: "تسويق قائم على البيانات لإطلاق منتج" },
    description: {
      en: "Provided a full marketing strategy with analytics insights for a new product launch.",
      ar: "قدمنا خطة تسويقية متكاملة مع تحليلات لمنتج جديد عند الإطلاق.",
    },
    category: { en: "Marketing Strategy", ar: "استراتيجية تسويق" },
    client: { en: "NewProduct Co", ar: "نيو برودكت" },
    year: "2024",
    duration: { en: "2 months", ar: "شهران" },
    skills: ["SEO", "Google Analytics", "Email Marketing"],
    tools: ["Google Analytics", "SEMrush", "Mailchimp", "HubSpot"],
    results: [
      { value: "250%", label: { en: "Lead Increase", ar: "زيادة العملاء" }, icon: "users" },
      { value: "35%", label: { en: "CAC Reduction", ar: "انخفاض التكلفة" }, icon: "dollar" },
    ],
    relatedProjects: [3],
  },
  {
    id: 7,
    imgSrc: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200",
    ],
    title: { en: "AI Chatbot Integration", ar: "تكامل روبوت الدردشة الذكي" },
    tagline: { en: "24/7 automated customer support", ar: "دعم عملاء آلي على مدار الساعة" },
    description: {
      en: "Implemented an AI-powered chatbot for customer service automation and 24/7 support.",
      ar: "تطبيق روبوت دردشة ذكي لأتمتة خدمة العملاء والدعم على مدار الساعة.",
    },
    category: { en: "AI & Machine Learning", ar: "الذكاء الاصطناعي" },
    client: { en: "ServiceCorp", ar: "سيرفس كورب" },
    year: "2024",
    duration: { en: "3 months", ar: "3 أشهر" },
    skills: ["Python", "TensorFlow", "Natural Language Processing"],
    tools: ["Python", "TensorFlow", "FastAPI", "Docker"],
    results: [
      { value: "70%", label: { en: "Support Cost Reduction", ar: "تخفيض تكلفة الدعم" }, icon: "dollar" },
      { value: "24/7", label: { en: "Availability", ar: "التوفر" }, icon: "clock" },
    ],
    relatedProjects: [1],
  },
  {
    id: 8,
    imgSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
    ],
    title: { en: "Cloud Infrastructure Setup", ar: "إعداد البنية التحتية السحابية" },
    tagline: { en: "Scalable cloud infrastructure with automation", ar: "بنية سحابية قابلة للتوسع مع الأتمتة" },
    description: {
      en: "Migrated company infrastructure to cloud with automated scaling and monitoring systems.",
      ar: "نقل البنية التحتية للشركة إلى السحابة مع أنظمة تكييف ومراقبة تلقائية.",
    },
    category: { en: "Cloud Computing", ar: "الحوسبة السحابية" },
    client: { en: "Enterprise Corp", ar: "إنتربرايز كورب" },
    year: "2023",
    duration: { en: "5 months", ar: "5 أشهر" },
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    tools: ["AWS", "Terraform", "Kubernetes", "Prometheus"],
    results: [
      { value: "40%", label: { en: "Cost Savings", ar: "توفير في التكلفة" }, icon: "dollar" },
      { value: "99.99%", label: { en: "Uptime SLA", ar: "ضمان التشغيل" }, icon: "check" },
    ],
    relatedProjects: [7],
  },
  {
    id: 9,
    imgSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
    ],
    title: { en: "Data Analytics Dashboard", ar: "لوحة تحليل البيانات" },
    tagline: { en: "Real-time business intelligence platform", ar: "منصة ذكاء الأعمال في الوقت الفعلي" },
    description: {
      en: "Built an interactive dashboard for real-time business analytics and reporting insights.",
      ar: "بناء لوحة تحكم تفاعلية لتحليل الأعمال والتقارير في الوقت الفعلي.",
    },
    category: { en: "Data Science", ar: "علوم البيانات" },
    client: { en: "BusinessInsights", ar: "بيزنس إنسايتس" },
    year: "2024",
    duration: { en: "4 months", ar: "4 أشهر" },
    skills: ["Python", "D3.js", "PostgreSQL", "Power BI"],
    tools: ["Python", "D3.js", "PostgreSQL", "Redis"],
    results: [
      { value: "75%", label: { en: "Faster Decisions", ar: "قرارات أسرع" }, icon: "zap" },
      { value: "100+", label: { en: "Custom Reports", ar: "تقارير مخصصة" }, icon: "file" },
    ],
    relatedProjects: [8],
  },
  {
    id: 10,
    imgSrc: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
    ],
    title: { en: "IoT Smart Home System", ar: "نظام المنزل الذكي" },
    tagline: { en: "Complete home automation solution", ar: "حل كامل لأتمتة المنزل" },
    description: {
      en: "Developed a comprehensive IoT system for home automation with mobile app control.",
      ar: "تطوير نظام إنترنت الأشياء شامل لأتمتة المنزل مع تحكم عبر التطبيق.",
    },
    category: { en: "IoT Development", ar: "تطوير إنترنت الأشياء" },
    client: { en: "SmartHome Inc", ar: "سمارت هوم" },
    year: "2023",
    duration: { en: "8 months", ar: "8 أشهر" },
    skills: ["Arduino", "Raspberry Pi", "Flutter", "MQTT"],
    tools: ["Arduino", "Raspberry Pi", "Flutter", "AWS IoT"],
    results: [
      { value: "50+", label: { en: "Device Types", ar: "أنواع الأجهزة" }, icon: "cpu" },
      { value: "10K+", label: { en: "Users", ar: "المستخدمين" }, icon: "users" },
    ],
    relatedProjects: [4],
  },
  {
    id: 11,
    imgSrc: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200",
    ],
    title: { en: "Cybersecurity Audit", ar: "تدقيق الأمن السيبراني" },
    tagline: { en: "Comprehensive security assessment", ar: "تقييم أمني شامل" },
    description: {
      en: "Conducted comprehensive security assessment and implemented protection measures for enterprise.",
      ar: "إجراء تقييم أمني شامل وتنفيذ تدابير الحماية للمؤسسات.",
    },
    category: { en: "Cybersecurity", ar: "الأمن السيبراني" },
    client: { en: "FinanceCorp", ar: "فاينانس كورب" },
    year: "2024",
    duration: { en: "2 months", ar: "شهران" },
    skills: ["Penetration Testing", "Network Security", "Encryption"],
    tools: ["Nessus", "Wireshark", "Metasploit", "Splunk"],
    results: [
      { value: "50+", label: { en: "Vulnerabilities Found", ar: "الثغرات المكتشفة" }, icon: "shield" },
      { value: "100%", label: { en: "Remediation", ar: "المعالجة" }, icon: "check" },
    ],
    relatedProjects: [8],
  },
  {
    id: 12,
    imgSrc: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920",
    gallery: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200",
    ],
    title: { en: "Blockchain Payment System", ar: "نظام دفع البلوك تشين" },
    tagline: { en: "Secure crypto payment integration", ar: "تكامل دفع تشفير آمن" },
    description: {
      en: "Created a secure blockchain-based payment system with cryptocurrency integration.",
      ar: "إنشاء نظام دفع آمن قائم على البلوك تشين مع تكامل العملات المشفرة.",
    },
    category: { en: "Blockchain", ar: "البلوك تشين" },
    client: { en: "CryptoPay", ar: "كريبتو باي" },
    year: "2024",
    duration: { en: "5 months", ar: "5 أشهر" },
    skills: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts"],
    tools: ["Solidity", "Hardhat", "Web3.js", "IPFS"],
    results: [
      { value: "$10M+", label: { en: "Transactions Processed", ar: "المعاملات" }, icon: "dollar" },
      { value: "0", label: { en: "Security Incidents", ar: "حوادث أمنية" }, icon: "shield" },
    ],
    relatedProjects: [1],
  },
];