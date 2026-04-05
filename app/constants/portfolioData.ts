export interface ProjectProcess {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
}

export interface Testimonial {
  quote: { en: string; ar: string };
  author: { en: string; ar: string };
  role: { en: string; ar: string };
}

export interface Metric {
  value: string;
  label: { en: string; ar: string };
}

export interface PortfolioProject {
  id: number;
  imgSrc: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  category: { en: string; ar: string };
  tools: string[];
  services: string[];
  metrics: Metric[];
  year: string;
  client: { en: string; ar: string };
  duration: { en: string; ar: string };
  gallery: string[];
  featured?: boolean;
  spotlight?: {
    tagline: { en: string; ar: string };
    challenge: { en: string; ar: string };
    solution: { en: string; ar: string };
    coverImage: string;
    liveUrl?: string;
    process?: ProjectProcess[];
    testimonial?: Testimonial;
  };
}

export const portfolioData: PortfolioProject[] = [
  {
    id: 1,
    imgSrc:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    ],
    title: { en: "E-Commerce Platform", ar: "منصة تجارة إلكترونية" },
    description: {
      en: "A seamless shopping experience with integrated payments and inventory management.",
      ar: "تجربة تسوق سلسة مع أنظمة الدفع وإدارة المخزون المدمجة.",
    },
    category: { en: "Web Development", ar: "تطوير الويب" },
    client: { en: "RetailCo", ar: "ريتايلكو" },
    duration: { en: "4 months", ar: "4 أشهر" },
    services: [
      "UI/UX Design",
      "Frontend Development",
      "Backend Development",
      "Payment Integration",
    ],
    tools: ["React", "Node.js", "MongoDB", "Stripe"],
    metrics: [
      { value: "3x", label: { en: "Conversion Rate", ar: "معدل التحويل" } },
      { value: "<1s", label: { en: "Page Load Time", ar: "وقت التحميل" } },
      { value: "99.9%", label: { en: "Uptime", ar: "وقت التشغيل" } },
      { value: "50K+", label: { en: "Monthly Users", ar: "مستخدم شهرياً" } },
    ],
    year: "2024",
    featured: true,
    spotlight: {
      tagline: {
        en: "Redefining online retail for the MENA region",
        ar: "إعادة تعريف التجارة الإلكترونية في منطقة الشرق الأوسط",
      },
      challenge: {
        en: "The client needed a scalable e-commerce platform handling high traffic during peak seasons while maintaining fast load times and a seamless checkout experience across devices.",
        ar: "احتاج العميل منصة تجارة إلكترونية قابلة للتوسع تتعامل مع الحركة العالية في مواسم الذروة مع الحفاظ على سرعة التحميل وتجربة دفع سلسة عبر الأجهزة.",
      },
      solution: {
        en: "We built a microservices architecture with React frontend for a responsive shopping experience, Node.js backend for scalability, MongoDB for flexible product catalogs, and Stripe for secure multi-currency payments. Redis caching ensures sub-second page loads even during flash sales.",
        ar: "بناء بنية خدمات مصغرة مع React للواجهة الأمامية و Node.js للخادم و MongoDB لكتالوجات المنتجات المرنة و Stripe للمدفوعات الآمنة متعددة العملات. يضمن التخزين المؤقت مع Redis تحميل الصفحات في أقل من ثانية حتى خلال عروض البيع السريع.",
      },
      coverImage:
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&q=80",
      liveUrl: "https://example.com",
      process: [
        {
          title: { en: "Discovery", ar: "الاكتشاف" },
          description: {
            en: "User research, competitive analysis, and technical requirements gathering.",
            ar: "أبحاث المستخدم والتحليل التنافسي وجمع المتطلبات التقنية.",
          },
        },
        {
          title: { en: "Design", ar: "التصميم" },
          description: {
            en: "Wireframes, UI design system, and interactive prototypes with user testing.",
            ar: "إطارات سلكية ونظام تصميم الواجهة ونماذج تفاعلية مع اختبار المستخدم.",
          },
        },
        {
          title: { en: "Development", ar: "التطوير" },
          description: {
            en: "Full-stack implementation with continuous integration and code reviews.",
            ar: "تنفيذ كامل المكدس مع التكامل المستمر ومراجعات الكود.",
          },
        },
        {
          title: { en: "Launch", ar: "الإطلاق" },
          description: {
            en: "Staged rollout, performance monitoring, and optimization.",
            ar: "طرح مرحلي ومراقبة الأداء والتحسين.",
          },
        },
      ],
      testimonial: {
        quote: {
          en: "Sanad transformed our online presence. The new platform handles 3x our previous traffic with half the load time. Our customers love the seamless checkout experience.",
          ar: "حول سند حضورنا الرقمي. المنصة الجديدة تتعامل مع 3 أضعاف حركة المرور السابقة بنصف وقت التحميل. عملاؤنا يحبون تجربة الدفع السلسة.",
        },
        author: { en: "Sara Al-Mahmoud", ar: "سارة المحمود" },
        role: { en: "CTO, RetailCo", ar: "مدير التقنية، ريتايلكو" },
      },
    },
  },
  {
    id: 2,
    imgSrc:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
    ],
    title: { en: "Brand Identity Design", ar: "تصميم هوية بصرية" },
    description: {
      en: "Complete visual identity for a tech startup including logo, typography, and brand system.",
      ar: "هوية بصرية كاملة لشركة ناشئة تشمل الشعار والخطوط ونظام العلامة التجارية.",
    },
    category: { en: "Branding", ar: "العلامة التجارية" },
    client: { en: "TechVenture", ar: "تك فنتشر" },
    duration: { en: "2 months", ar: "شهران" },
    services: [
      "Brand Strategy",
      "Logo Design",
      "Visual Identity",
      "Brand Guidelines",
    ],
    tools: ["Figma", "Illustrator", "After Effects"],
    metrics: [
      {
        value: "100%",
        label: { en: "Brand Recognition", ar: "الوعي بالعلامة" },
      },
      { value: "40%", label: { en: "Increase in Leads", ar: "زيادة العملاء" } },
    ],
    year: "2024",
    spotlight: {
      tagline: {
        en: "Complete visual identity for a tech startup",
        ar: "هوية بصرية كاملة لشركة تقنية ناشئة",
      },
      challenge: {
        en: "A new tech startup needed a distinctive visual identity that would set them apart in a crowded market and communicate their innovative approach to potential investors.",
        ar: "احتاجت شركة تقنية ناشئة جديدة إلى هوية بصرية مميزة تميزها في سوق مزدحم وتتواصل مع نهجها المبتكر للمستثمرين المحتملين.",
      },
      solution: {
        en: "Created a bold, modern brand system with custom logo design, color palette, typography system, and comprehensive brand guidelines. The identity balances professionalism with approachability — perfect for a startup seeking investment.",
        ar: "تم إنشاء نظام علامة تجارية جريء وحديث مع تصميم شعار مخصص ولوحة ألوان ونظام خطوط وإرشادات شاملة للعلامة التجارية.",
      },
      coverImage:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
      process: [
        {
          title: { en: "Research", ar: "البحث" },
          description: {
            en: "Market analysis, competitor review, and stakeholder interviews.",
            ar: "تحليل السوق ومراجعة المنافسين ومقابلات أصحاب المصلحة.",
          },
        },
        {
          title: { en: "Concept", ar: "المفهوم" },
          description: {
            en: "Mood boards, logo exploration, and direction selection.",
            ar: "لوحات المزاج واستكشاف الشعار واختيار الاتجاه.",
          },
        },
        {
          title: { en: "Development", ar: "التطوير" },
          description: {
            en: "Refined design system, color palette, and typography.",
            ar: "نظام التصميم المكرر ولوحة الألوان والخطوط.",
          },
        },
        {
          title: { en: "Delivery", ar: "التسليم" },
          description: {
            en: "Brand guidelines document and asset library.",
            ar: "وثيقة إرشادات العلامة التجارية ومكتبة الأصول.",
          },
        },
      ],
    },
  },
  {
    id: 3,
    imgSrc:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1200&q=80",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
    ],
    title: { en: "Social Media Campaign", ar: "حملة وسائل التواصل" },
    description: {
      en: "Month-long campaign driving brand awareness and engagement across multiple platforms.",
      ar: "حملة شهرية تزيد الوعي بالعلامة التجارية والتفاعل عبر منصات متعددة.",
    },
    category: { en: "Digital Marketing", ar: "التسويق الرقمي" },
    client: { en: "FashionHouse", ar: "هاوس فاشن" },
    duration: { en: "1 month", ar: "شهر واحد" },
    services: ["Strategy", "Content Creation", "Paid Advertising", "Analytics"],
    tools: ["Meta Ads", "Google Analytics", "HubSpot"],
    metrics: [
      { value: "5M+", label: { en: "Impressions", ar: "مرات الظهور" } },
      { value: "180%", label: { en: "Engagement Rate", ar: "معدل التفاعل" } },
      { value: "3x", label: { en: "ROAS", ar: "العائد على الإنفاق" } },
    ],
    year: "2024",
    spotlight: {
      tagline: {
        en: "Month-long campaign driving brand awareness",
        ar: "حملة شهرية تزيد الوعي بالعلامة التجارية",
      },
      challenge: {
        en: "A retail brand needed to rapidly increase brand awareness during a competitive season with limited budget but ambitious targets.",
        ar: "احتاجت علامة تجارية تجزئة إلى زيادة سريعة في الوعي بالعلامة خلال موسم تنافسي بميزانية محدودة وأهداف طموحة.",
      },
      solution: {
        en: "Developed a multi-platform campaign with targeted content creation, strategic paid advertising across Meta and Google, and real-time analytics optimization to maximize ROAS.",
        ar: "تطوير حملة متعددة المنصات مع إنشاء محتوى مستهدف وإعلانات مدفوعة استراتيجية وتحليلات في الوقت الفعلي لتعظيم العائد على الإنفاق.",
      },
      coverImage:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
    },
  },
  {
    id: 4,
    imgSrc:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
      "https://images.unsplash.com/photo-1526628953301-4b799315345d?w=1200&q=80",
    ],
    title: { en: "Mobile Delivery App", ar: "تطبيق توصيل" },
    description: {
      en: "Real-time food delivery with GPS tracking, online payments, and driver management.",
      ar: "توصيل طعام بالتتبع اللحظي والدفع الإلكتروني وإدارة السائقين.",
    },
    category: { en: "Mobile App", ar: "تطبيقات الجوال" },
    client: { en: "FoodExpress", ar: "فود إكسبريس" },
    duration: { en: "6 months", ar: "6 أشهر" },
    services: [
      "UX Research",
      "Mobile Design",
      "React Native Development",
      "Backend API",
    ],
    tools: ["React Native", "Firebase", "Google Maps"],
    metrics: [
      { value: "100K+", label: { en: "Downloads", ar: "التنزيلات" } },
      { value: "4.8★", label: { en: "App Rating", ar: "تقييم التطبيق" } },
      { value: "25min", label: { en: "Avg. Delivery", ar: "متوسط التوصيل" } },
    ],
    year: "2023",
    featured: true,
    spotlight: {
      tagline: {
        en: "From order to door in under 30 minutes",
        ar: "من الطلب إلى التوصيل في أقل من 30 دقيقة",
      },
      challenge: {
        en: "The client wanted a food delivery app competing with major players by offering faster delivery, better UX, and a transparent real-time tracking system for customers.",
        ar: "أراد العميل تطبيق توصيل طعام ينافس اللاعبين الكبار من خلال توصيل أسرع وتجربة مستخدم أفضل ونظام تتبع لحظي شفاف للعملاء.",
      },
      solution: {
        en: "Built with React Native for cross-platform performance, Firebase for real-time order tracking, Google Maps integration for live driver location, and optimized routing algorithms that reduced average delivery time to 25 minutes.",
        ar: "تم البناء بـ React Native للأداء عبر المنصات و Firebase للتتبع اللحظي للطلبات وتكامل خرائط جوجل لموقع السائق الحي وخوارزميات التوجيه المحسّنة التي قللت متوسط وقت التوصيل إلى 25 دقيقة.",
      },
      coverImage:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80",
      process: [
        {
          title: { en: "Research", ar: "البحث" },
          description: {
            en: "User interviews with 50+ customers and 20 drivers to understand pain points.",
            ar: "مقابلات مع أكثر من 50 عميلاً و20 سائقاً لفهم نقاط الألم.",
          },
        },
        {
          title: { en: "Design", ar: "التصميم" },
          description: {
            en: "Wireframes, prototyping, and usability testing across both apps.",
            ar: "إطارات سلكية ونماذج أولية واختبار قابلية الاستخدام.",
          },
        },
        {
          title: { en: "Development", ar: "التطوير" },
          description: {
            en: "React Native, Firebase, and Google Maps integration.",
            ar: "React Native و Firebase وتكامل خرائط جوجل.",
          },
        },
        {
          title: { en: "Testing", ar: "الاختبار" },
          description: {
            en: "Beta testing with 500 users before public launch.",
            ar: "اختبار بيتا مع 500 مستخدم قبل الإطلاق العام.",
          },
        },
        {
          title: { en: "Launch", ar: "الإطلاق" },
          description: {
            en: "App Store & Google Play submission with marketing support.",
            ar: "تقديم لمتجر التطبيقات وتسويق الدعم.",
          },
        },
      ],
      testimonial: {
        quote: {
          en: "The app exceeded our expectations. 100K downloads in the first quarter and a 4.8-star rating. Our customers love the real-time tracking.",
          ar: "التطبيق تجاوز توقعاتنا. 100 ألف تنزيل في الربع الأول الأول وتقييم 4.8 نجوم. عملاؤنا يحبون التتبع اللحظي.",
        },
        author: { en: "Omar Hassan", ar: "عمر حسن" },
        role: { en: "CEO, FoodExpress", ar: "الرئيس التنفيذي، فود إكسبريس" },
      },
    },
  },
  {
    id: 5,
    imgSrc:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    ],
    title: { en: "Corporate Website", ar: "موقع شركة" },
    description: {
      en: "Multilingual corporate website with CMS, blog, and lead generation forms.",
      ar: "موقع شركة متعدد اللغات مع نظام إدارة المحتوى والمدونة ونماذج جلب العملاء.",
    },
    category: { en: "Web Development", ar: "تطوير الويب" },
    client: { en: "ConsultPro", ar: "كونسلت برو" },
    duration: { en: "3 months", ar: "3 أشهر" },
    services: ["Web Design", "CMS Development", "SEO", "Multilingual Support"],
    tools: ["Next.js", "Tailwind CSS", "i18next"],
    metrics: [
      { value: "60%", label: { en: "Traffic Increase", ar: "زيادة الحركة" } },
      { value: "40%", label: { en: "Lead Increase", ar: "زيادة العملاء" } },
    ],
    year: "2023",
  },
  {
    id: 6,
    imgSrc:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    ],
    title: { en: "Analytics Dashboard", ar: "لوحة تحليل البيانات" },
    description: {
      en: "Real-time business intelligence platform with custom reports and data visualization.",
      ar: "منصة ذكاء أعمال في الوقت الفعلي مع تقارير مخصصة وتصوير البيانات.",
    },
    category: { en: "Data & Analytics", ar: "البيانات والتحليلات" },
    client: { en: "BusinessInsights", ar: "بيزنس إنسايتس" },
    duration: { en: "4 months", ar: "4 أشهر" },
    services: [
      "Data Architecture",
      "Dashboard Design",
      "Backend Development",
      "Real-time Processing",
    ],
    tools: ["Python", "D3.js", "PostgreSQL", "Redis"],
    metrics: [
      { value: "75%", label: { en: "Faster Decisions", ar: "قرارات أسرع" } },
      { value: "100+", label: { en: "Custom Reports", ar: "تقرير مخصص" } },
      {
        value: "<1s",
        label: { en: "Query Response", ar: "استعلام الاستجابة" },
      },
    ],
    year: "2024",
    featured: true,
    spotlight: {
      tagline: {
        en: "Turning raw data into actionable insights",
        ar: "تحويل البيانات الخام إلى رؤى قابلة للتنفيذ",
      },
      challenge: {
        en: "The client needed a centralized dashboard to replace fragmented spreadsheets and enable real-time decision making across 5 departments with different data needs.",
        ar: "احتاج العميل لوحة تحكم مركزية لاستبدال جداول البيانات المجزأة وتمكين اتخاذ القرارات في الوقت الفعلي عبر 5 أقسام باحتياجات بيانات مختلفة.",
      },
      solution: {
        en: "Built a real-time analytics platform with Python backend processing millions of data points, D3.js for interactive visualizations, PostgreSQL for storage, and Redis caching delivering sub-second query responses even under heavy load.",
        ar: "تم بناء منصة تحليلات في الوقت الفعلي مع Python و D3.js للتصورات التفاعلية و PostgreSQL للتخزين و Redis للتخزين المؤقت.",
      },
      coverImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      process: [
        {
          title: { en: "Discovery", ar: "الاكتشاف" },
          description: {
            en: "Stakeholder interviews and data source mapping across departments.",
            ar: "مقابلات أصحاب المصلحة ورسم خرائط مصادر البيانات.",
          },
        },
        {
          title: { en: "Architecture", ar: "البنية" },
          description: {
            en: "Data pipeline design and database schema optimization.",
            ar: "تصميم خط الأنابيب وتحسين مخطط قاعدة البيانات.",
          },
        },
        {
          title: { en: "Development", ar: "التطوير" },
          description: {
            en: "Full-stack implementation with real-time data processing.",
            ar: "تنفيذ كامل المكدس مع معالجة البيانات في الوقت الفعلي.",
          },
        },
        {
          title: { en: "Training", ar: "التدريب" },
          description: {
            en: "User onboarding sessions for each department.",
            ar: "جلسات تأهيل المستخدم لكل قسم.",
          },
        },
      ],
    },
  },
  {
    id: 7,
    imgSrc:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    ],
    title: { en: "AI Chatbot Integration", ar: "تكامل روبوت الذكاء الاصطناعي" },
    description: {
      en: "24/7 automated customer support powered by natural language processing.",
      ar: "دعم عملاء آلي على مدار الساعة مدعوم بمعالجة اللغة الطبيعية.",
    },
    category: { en: "AI & Automation", ar: "الذكاء الاصطناعي والأتمتة" },
    client: { en: "ServiceCorp", ar: "سيرفس كورب" },
    duration: { en: "3 months", ar: "3 أشهر" },
    services: [
      "AI Strategy",
      "NLP Development",
      "Integration",
      "Training & Testing",
    ],
    tools: ["Python", "TensorFlow", "FastAPI", "Docker"],
    metrics: [
      {
        value: "70%",
        label: { en: "Support Cost Saved", ar: "توفير تكلفة الدعم" },
      },
      { value: "24/7", label: { en: "Availability", ar: "التوفر" } },
    ],
    year: "2024",
  },
  {
    id: 8,
    imgSrc:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    ],
    title: { en: "Cloud Infrastructure", ar: "البنية التحتية السحابية" },
    description: {
      en: "Scalable cloud migration with automated scaling, monitoring, and CI/CD pipelines.",
      ar: "نقل سحابي قابل للتوسع مع المراقبة وخطوط CI/CD.",
    },
    category: { en: "Cloud & DevOps", ar: "السحابة و DevOps" },
    client: { en: "Enterprise Corp", ar: "إنتربرايز كورب" },
    duration: { en: "5 months", ar: "5 أشهر" },
    services: [
      "Cloud Strategy",
      "Infrastructure as Code",
      "CI/CD",
      "Monitoring",
    ],
    tools: ["AWS", "Terraform", "Kubernetes", "Prometheus"],
    metrics: [
      { value: "40%", label: { en: "Cost Saved", ar: "توفير التكلفة" } },
      { value: "99.99%", label: { en: "Uptime SLA", ar: "ضمان التشغيل" } },
    ],
    year: "2023",
  },
  {
    id: 9,
    imgSrc:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
    ],
    title: { en: "Fashion E-Commerce", ar: "تجارة أزياء إلكترونية" },
    description: {
      en: "Luxury fashion storefront with AR try-on, wishlists, and personalized recommendations.",
      ar: "متجر أزياء فاخر مع تجربة الواقع المعزز والقوائم المخصصة والتوصيات الشخصية.",
    },
    category: { en: "Web Development", ar: "تطوير الويب" },
    client: { en: "LuxBrand", ar: "لاكس براند" },
    duration: { en: "5 months", ar: "5 أشهر" },
    services: [
      "E-Commerce Design",
      "AR Integration",
      "Personalization Engine",
      "Analytics",
    ],
    tools: ["Next.js", "Shopify API", "Three.js", "Stripe"],
    metrics: [
      { value: "5x", label: { en: "ROAS", ar: "العائد" } },
      { value: "25%", label: { en: "Conversion Rate", ar: "معدل التحويل" } },
    ],
    year: "2024",
  },
  {
    id: 10,
    imgSrc:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
    ],
    title: { en: "Mobile Banking App", ar: "تطبيق مصرف رقمي" },
    description: {
      en: "Secure mobile banking with biometric auth, transfers, and spending insights.",
      ar: "مصرف رقمي آمن مع المصادقة الحيوية والتحويلات ورؤى الإنفاق.",
    },
    category: { en: "Mobile App", ar: "تطبيقات الجوال" },
    client: { en: "NeoBank", ar: "نيو بانك" },
    duration: { en: "7 months", ar: "7 أشهر" },
    services: [
      "Security Architecture",
      "Mobile Design",
      "API Integration",
      "Accessibility",
    ],
    tools: ["Flutter", "Firebase", "Plaid API", "AWS"],
    metrics: [
      { value: "250K+", label: { en: "Users", ar: "مستخدم" } },
      { value: "4.9★", label: { en: "App Rating", ar: "التقييم" } },
      { value: "0", label: { en: "Security Breaches", ar: "اختراقات أمنية" } },
    ],
    year: "2024",
    featured: true,
    spotlight: {
      tagline: {
        en: "Banking in your pocket, secured by design",
        ar: "المصرف في جيبك، مؤمن بالتصميم",
      },
      challenge: {
        en: "The bank wanted to digitize their services while maintaining the highest security standards and providing an intuitive experience for all age groups, from tech-savvy millennials to older customers less comfortable with technology.",
        ar: "أراد البنك رقمنة خدماته مع الحفاظ على أعلى معايير الأمان وتوفير تجربة بديهية لجميع الفئات العمرية.",
      },
      solution: {
        en: "Developed a Flutter-based cross-platform app with biometric authentication, Plaid API integration for account linking, end-to-end encryption, and an accessibility-first design approach that earned a 4.9-star rating across 250K+ users.",
        ar: "تم تطوير تطبيق عبر المنصات بـ Flutter مع المصادقة الحيوية وتكامل Plaid API والتشفير الشامل وتصميم يركز على إمكانية الوصول.",
      },
      coverImage:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
      process: [
        {
          title: { en: "Compliance", ar: "الامتثال" },
          description: {
            en: "Security requirements and regulatory compliance review.",
            ar: "متطلبات الأمان ومراجعة الامتثال التنظيمي.",
          },
        },
        {
          title: { en: "Design", ar: "التصميم" },
          description: {
            en: "Accessibility-first design with user testing across age groups.",
            ar: "تصميم يركز على إمكانية الوصول مع اختبار المستخدم.",
          },
        },
        {
          title: { en: "Development", ar: "التطوير" },
          description: {
            en: "Flutter implementation with biometric auth and encryption.",
            ar: "تنفيذ Flutter مع المصادقة الحيوية والتشفير.",
          },
        },
        {
          title: { en: "Security Audit", ar: "التدقيق الأمني" },
          description: {
            en: "Penetration testing and vulnerability assessment.",
            ar: "اختبار الاختراق وتقييم الثغرات.",
          },
        },
        {
          title: { en: "Launch", ar: "الإطلاق" },
          description: {
            en: "Phased rollout with continuous monitoring.",
            ar: "طرح مرحلي مع المراقبة المستمرة.",
          },
        },
      ],
      testimonial: {
        quote: {
          en: "Sanad delivered an app that our customers genuinely love. The security is impeccable — zero breaches since launch — and the UX keeps people coming back.",
          ar: "قدم سند تطبيق يحبه عملاؤنا بالفعل. الأمان لا تشوبه شائبة - صفر اختراقات منذ الإطلاق - وتجربة المستخدم تبقي الناس يعودون.",
        },
        author: { en: "Layla Nasser", ar: "ليلى ناصر" },
        role: { en: "Head of Digital, NeoBank", ar: "رئيسة الرقمي، نيو بانك" },
      },
    },
  },
  {
    id: 11,
    imgSrc:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80",
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&q=80",
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80",
    ],
    title: { en: "Learning Management System", ar: "نظام إدارة التعلم" },
    description: {
      en: "Corporate LMS with video courses, assessments, certifications, and progress tracking.",
      ar: "نظام إدارة تعلم مؤسسي مع دورات فيديو وتقييمات وشهادات وتتبع التقدم.",
    },
    category: { en: "Web Development", ar: "تطوير الويب" },
    client: { en: "EduCorp", ar: "إيديو كورب" },
    duration: { en: "5 months", ar: "5 أشهر" },
    services: [
      "Platform Design",
      "Video Infrastructure",
      "Assessment Engine",
      "Certification",
    ],
    tools: ["React", "Django", "PostgreSQL", "AWS S3"],
    metrics: [
      { value: "10K+", label: { en: "Learners", ar: "متعلم" } },
      { value: "95%", label: { en: "Completion Rate", ar: "معدل الإكمال" } },
    ],
    year: "2023",
  },
  {
    id: 12,
    imgSrc:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80",
    ],
    title: { en: "Cybersecurity Audit", ar: "تدقيق أمني" },
    description: {
      en: "Comprehensive security assessment with penetration testing and remediation plan.",
      ar: "تقييم أمني شامل مع اختبار اختراق وخطة معالجة.",
    },
    category: { en: "Cloud & DevOps", ar: "السحابة و DevOps" },
    client: { en: "FinanceCorp", ar: "فاينانس كورب" },
    duration: { en: "2 months", ar: "شهران" },
    services: [
      "Penetration Testing",
      "Vulnerability Assessment",
      "Remediation Plan",
      "Training",
    ],
    tools: ["Nessus", "Wireshark", "Metasploit", "Splunk"],
    metrics: [
      {
        value: "50+",
        label: { en: "Vulnerabilities Found", ar: "ثغرة مكتشفة" },
      },
      { value: "100%", label: { en: "Remediated", ar: "تم إصلاحها" } },
    ],
    year: "2024",
  },
];

export const statsData = [
  {
    value: "50",
    numericValue: 50,
    suffix: "+",
    label: { en: "Projects Delivered", ar: "مشروع مُنجز" },
  },
  {
    value: "98",
    numericValue: 98,
    suffix: "%",
    label: { en: "Client Satisfaction", ar: "رضا العملاء" },
  },
  {
    value: "12",
    numericValue: 12,
    suffix: "",
    label: { en: "Industries Served", ar: "قطاع مخدوم" },
  },
  {
    value: "3",
    numericValue: 3,
    suffix: "",
    label: { en: "Countries", ar: "دولة" },
  },
];

export const categories = [
  { en: "All", ar: "الكل" },
  { en: "Web Development", ar: "تطوير الويب" },
  { en: "Mobile App", ar: "تطبيقات الجوال" },
  { en: "Branding", ar: "العلامة التجارية" },
  { en: "Digital Marketing", ar: "التسويق الرقمي" },
  { en: "AI & Automation", ar: "الذكاء الاصطناعي والأتمتة" },
  { en: "Cloud & DevOps", ar: "السحابة و DevOps" },
  { en: "Data & Analytics", ar: "البيانات والتحليلات" },
];
