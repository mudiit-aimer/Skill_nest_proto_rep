const CATALOG = {
  Development: [
    { title: 'React Product Engineering', tags: ['React', 'Hooks', 'Architecture'] },
    { title: 'Node.js API Masterclass', tags: ['Node.js', 'Express', 'REST'] },
    { title: 'Fullstack TypeScript Launchpad', tags: ['TypeScript', 'Frontend', 'Backend'] },
    { title: 'System Design for Builders', tags: ['Scalability', 'Distributed Systems', 'Design'] },
    { title: 'Testing Modern JavaScript Apps', tags: ['Jest', 'Testing Library', 'CI'] },
  ],
  Design: [
    { title: 'UI Design Foundations', tags: ['Visual Design', 'Layout', 'Hierarchy'] },
    { title: 'Advanced UX Research', tags: ['Interviews', 'Usability', 'Insight'] },
    { title: 'Figma from Wireframe to Prototype', tags: ['Figma', 'Prototyping', 'Components'] },
    { title: 'Design Systems in Practice', tags: ['Tokens', 'Patterns', 'Governance'] },
    { title: 'Brand Identity Workshop', tags: ['Brand', 'Typography', 'Color'] },
  ],
  'Data Science': [
    { title: 'Python for Data Analysis', tags: ['Python', 'Pandas', 'Notebooks'] },
    { title: 'Machine Learning Fundamentals', tags: ['ML', 'Supervised Learning', 'Metrics'] },
    { title: 'Practical Deep Learning', tags: ['Neural Nets', 'PyTorch', 'Training'] },
    { title: 'Data Visualization Storytelling', tags: ['Charts', 'Narrative', 'Dashboards'] },
    { title: 'SQL for Analytics', tags: ['SQL', 'Joins', 'BI'] },
  ],
  Marketing: [
    { title: 'Digital Marketing Strategy', tags: ['Funnels', 'Positioning', 'Acquisition'] },
    { title: 'Performance Ads Bootcamp', tags: ['Meta Ads', 'Google Ads', 'Optimization'] },
    { title: 'SEO and Content Growth', tags: ['SEO', 'Content', 'Organic Growth'] },
    { title: 'Email Marketing That Converts', tags: ['Email', 'Automation', 'Conversion'] },
    { title: 'Social Media Brand Building', tags: ['Social Media', 'Brand', 'Community'] },
  ],
  Business: [
    { title: 'Product Management Essentials', tags: ['Roadmaps', 'Discovery', 'Delivery'] },
    { title: 'Startup Finance Basics', tags: ['Finance', 'Forecasting', 'Unit Economics'] },
    { title: 'Leadership for High Growth Teams', tags: ['Leadership', 'Culture', 'Hiring'] },
    { title: 'Negotiation and Influence', tags: ['Negotiation', 'Communication', 'Stakeholders'] },
    { title: 'Operations and Execution', tags: ['Operations', 'Processes', 'Execution'] },
  ],
  Photography: [
    { title: 'Photography Fundamentals', tags: ['Exposure', 'Composition', 'Lighting'] },
    { title: 'Portrait Photography Studio', tags: ['Portrait', 'Lighting', 'Direction'] },
    { title: 'Street Photography Storytelling', tags: ['Street', 'Narrative', 'Moments'] },
    { title: 'Mobile Photography Pro', tags: ['Mobile', 'Editing', 'Shots'] },
    { title: 'Photo Editing in Lightroom', tags: ['Lightroom', 'Color Grading', 'Workflow'] },
  ],
  Music: [
    { title: 'Music Production Fundamentals', tags: ['DAW', 'Arrangement', 'Mixing'] },
    { title: 'Songwriting Masterclass', tags: ['Songwriting', 'Melody', 'Lyrics'] },
    { title: 'Mixing and Mastering Basics', tags: ['Mixing', 'Mastering', 'Audio'] },
    { title: 'Electronic Beat Making', tags: ['Beat Making', 'Synths', 'Groove'] },
    { title: 'Home Studio Setup Guide', tags: ['Home Studio', 'Gear', 'Recording'] },
  ],
};

const INSTRUCTORS = [
  'Aarav Mehta',
  'Naina Kapoor',
  'Vihaan Sharma',
  'Ishita Rao',
  'Kabir Malhotra',
  'Mira Iyer',
  'Aditya Nair',
  'Sara Khan',
  'Rohan Bedi',
  'Anaya Sen',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = ['4 weeks', '5 weeks', '6 weeks', '8 weeks', '10 weeks'];

const IMAGE_BY_CATEGORY = {
  Development: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
  Design: 'https://images.unsplash.com/photo-1452802447250-470a88ac82bc?w=1200',
  'Data Science': 'https://images.unsplash.com/photo-1551281044-8b1d8c8d19f4?w=1200',
  Marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
  Business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
  Photography: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200',
  Music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200',
};

const slug = value => value.toLowerCase().replace(/\s+/g, '-');

export const SAMPLE_COURSES = Object.entries(CATALOG).flatMap(([category, entries], categoryIndex) =>
  entries.map((entry, index) => ({
    _id: `sample-${slug(category)}-${index + 1}`,
    title: entry.title,
    description: `${entry.title} is a practical, project-first course designed to help you build real skills quickly. You will work through guided lessons, feedback loops, and production-style assignments so you can apply what you learn immediately.`,
    instructor: INSTRUCTORS[(categoryIndex * 2 + index) % INSTRUCTORS.length],
    category,
    level: LEVELS[(categoryIndex + index) % LEVELS.length],
    price: index === 0 ? 0 : 1499 + (index * 600),
    duration: DURATIONS[(categoryIndex + index) % DURATIONS.length],
    image: IMAGE_BY_CATEGORY[category],
    rating: Number((4.2 + ((categoryIndex + index) % 7) * 0.1).toFixed(1)),
    enrolledCount: 1100 + categoryIndex * 240 + index * 180,
    tags: entry.tags,
  }))
);

export const getFeaturedSampleCourses = (limit = 3) =>
  SAMPLE_COURSES
    .slice()
    .sort((a, b) => b.rating - a.rating || b.enrolledCount - a.enrolledCount)
    .slice(0, limit);

export const getSampleCourseById = id =>
  SAMPLE_COURSES.find(course => course._id === id) || null;

export const filterSampleCourses = ({ category = 'All', level = 'All', search = '', page = 1, limit = 9 }) => {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = SAMPLE_COURSES.filter(course => {
    if (category !== 'All' && course.category !== category) return false;
    if (level !== 'All' && course.level !== level) return false;

    if (!normalizedSearch) return true;

    return [course.title, course.description, course.instructor, ...(course.tags || [])]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  });

  const safeLimit = Number(limit) > 0 ? Number(limit) : 9;
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.min(Math.max(1, Number(page) || 1), pages);
  const start = (safePage - 1) * safeLimit;

  return {
    courses: filtered.slice(start, start + safeLimit),
    total,
    pages,
    page: safePage,
  };
};
