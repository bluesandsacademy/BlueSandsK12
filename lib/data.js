import { BookOpen, Monitor, Users } from "lucide-react";
import { img } from "@/lib/cloudinary";

export const features = [
  {
    title: "Low-Bandwidth Optimized",
    description:
      "Designed to work seamlessly with limited internet connectivity common across African institutions. Smart caching and offline capabilities ensure uninterrupted learning.",
    image: img("/home/features/1.jpg"),
    bgGradient: "from-blue-100 to-blue-50",
  },
  {
    title: "Affordable Pricing",
    description:
      "Flexible payment plans in local currencies (Naira, Rand, Shilling) with special rates for African institutions. No hidden costs, transparent pricing.",
    image: img("/home/features/2.jpg"),
    bgGradient: "from-green-100 to-green-50",
  },
  {
    title: "200+ African-Relevant Labs",
    description:
      "Flexible payment plans in local currencies (Naira, Rand, Shilling) with special rates for African institutions. No hidden costs, transparent pricing.",
    image: img("/home/features/3.jpg"),
    bgGradient: "from-purple-100 to-purple-50",
  },
  {
    title: "Mobile-First Design",
    description:
      "Optimized for smartphones and tablets, acknowledging that mobile devices are often the primary internet access point for African students.",
    image: img("/home/features/4.jpg"),
    bgGradient: "from-orange-100 to-orange-50",
  },
  {
    title: "Multi-Language Support",
    description:
      "Available in English, French, Arabic, Swahili, and other major African languages to ensure accessibility across the continent.",
    image: img("/home/features/5.jpg"),
    bgGradient: "from-orange-100 to-orange-50",
  },
  {
    title: "Solar-Powered Compatibility",
    description:
      "Low-power consumption design works with solar charging stations and power-efficient devices common in rural African areas.",
    image: img("/home/features/6.jpg"),
    bgGradient: "from-orange-100 to-orange-50",
  },
];
export const teacherfeatures = [
  {
    title: "Lesson-Ready",
    description:
      "Classroom-ready on day one, getting educators off to a strong start with planning tools to save time before and during teaching.",
    image: img("/features/4.jpg"),
    keyPoints: [
      "Learning objectives, i.e, Transport Adaptive Nature products",
      "Pre-trip mini-quiz to determine individual or whole-class readiness",
      "Post-trip summary worksheet",
      "Network & audio-level VR commentary (specifically-catered for real classrooms)",
      "Downloadable printable (and shared student file-PDFs/Office teaching logs)",
      "Optional teacher Let's talk after-scenario, i.e. recap class discussion started for discussion",
    ],
  },
  {
    title: "Assign & Monitor",
    description:
      "Large classes supported as it keeps students in exploratory age, reaching their own understanding.",
    image: img("/features/5.jpg"),
    keyPoints: [
      "One-click assign: choose a VR sim, set due date, and (Gradable assessment) question preview",
      "Inside app summary: a holistic or drip unlock, and also a text-only option",
      "Real-time analytics; inside a holistic drip lock or assessment for in-progress or past-data",
      "Offline work: when internet's weak during, find distance sync late (and put your schedule-deadline)",
    ],
  },
  {
    title: "Assessment-Ready",
    description:
      "Questions make progress visible/not just a teacher's assessment guess/intuitions.",
    image: img("/features/6.jpg"),
    keyPoints: [
      "Audit, get evidence of student's failure, curiosity, labeling, and fact-sequence with holistic answers",
      'Auto-correction formative assessment: "Procedure", "Safety", "Results"',
      "Multi-type: analog single choice/free text practice bubble/chart",
      "Built-in offline quiz or scenario will feature/as a recall-test session",
      "Supports downloaded grades (e.g. CSV PDF saved or email/in calendar on devices)",
      "Individual or group projects, i.e. credit or inquiry-points",
    ],
  },
  {
    title: "Analytics That Matter",
    description:
      "Spot problems and progress in just a few seconds: reports that shape teachers' responses and how students work through the content.",
    image: img("/features/7.jpg"),
    keyPoints: [
      "Priority numbers: dashboard about how students' charts for each simulation",
      "What attempts: identify hardest/easiest and students who need follow-up coaching",
      'Time- or click-level events, presented in graphs, i.e. "not too far from a parallel chart"',
      "Seamless class growth meant. I.e., credit or strong points",
      "Export/backup: time-click report via PDF relevant panels in no-bandwidth",
    ],
  },
];
export const technicalFeatures = [
  {
    title: "Offline Engine",
    description: "Built most–especially for no-trust networks",
    image: img("/features/14.jpg"),
    keyPoints: [
      "Robust caching: non-essential parts cached to save bandwidth and run truly-Fully",
      "Student's sync: automatic simple-synch (resolution) for gradable and attempts",
      "Seamless training: exceptional on-store during internet errors/bad connectivity",
    ],
  },
  {
    title: "Scalability",
    description: "Built for big schools and low-trust environments",
    image: img("/features/15.jpg"),
    keyPoints: [
      "Up to large classes: tested at thousands of students across a school network",
      "Performance is project: fast load times and low hardware to cause and navigate/cost experiences",
    ],
  },
  {
    title: "Compatibility",
    description: "Works anywhere the student is: browser",
    image: img("/features/16.jpg"),
    keyPoints: [
      "Browser-based: run it in Chrome, Edge, Safari even no mobile platform",
      "Low-spec: mode-simplified APU/CPU for older devices",
      "Chromebooks: basically with features: fully supported (ideal-cost schools letting Chrome)",
    ],
  },
];
export const studentFeatures = [
  {
    title: "Students",
    description:
      "Students can explore a world of experiments through interactive simulations that make learning science exciting and easy to understand.",
    howItWorks: true,
    keyPoints: [
      "Sign Up & Choose a Subject: Access the Blue Sands STEM Labs platform via web or mobile app.",
      "Enter the Virtual Lab: Select your preferred subject, Physics, Chemistry, or Biology and explore a range of experiments aligned with your school curriculum.",
      "Perform Experiments: Follow step-by-step guides and simulate real-life experiments in a safe, interactive digital lab.",
      "Track Your Progress: Earn badges, track your performance, and receive instant feedback to improve your understanding.",
    ],
    image: img("/features/student1.jpg"), // Your student image path
  },
  {
    title: "Student Benefits",
    description: "",
    howItWorks: false,
    keyPoints: [
      "Hands-on science experience, even without a physical lab.",
      "Self-paced, gamified learning that builds confidence.",
      "Access to hundreds of virtual experiments anytime, anywhere.",
      "Visual, interactive content for better retention and comprehension.",
    ],
    image: img("/features/student2.jpg"),
  },
];
export const schoolFeatures = [
  {
    title: "Multi-Class Analytics",
    description: "A central dashboard of usage performance",
    image: img("/features/11.jpg"),
    keyPoints: [
      "Student-level results: subjects, subjects, basics—everything in one place",
      "Performance trends: identify where students need more support (by table-range-grade patterns)",
      "Cohort aggregates: one or more whole-class for district-leader school-admins",
    ],
  },
  {
    title: "Content Control",
    description: "Manage what's accessible and block student",
    image: img("/features/12.jpg"),
    keyPoints: [
      "Admins can control/enable/ organizing it in or school-customization",
      "Scheduled/publication: set what's active or an ideal-term/ideal or term sped",
      "Demo mode on: y/e-board in students (by preview), users viewing students",
    ],
  },
  {
    title: "Security & Compliance (Overview)",
    description:
      "Keeping you and your district secure (not just student's admin-clicks",
    image: img("/features/13.jpg"),
    keyPoints: [
      "Encryption: in transit and at rest",
      "Role: studies-how: (i.e. teacher-only but testing permissions)",
      "SSO/org support: connects with Google/School/SAML/common SSO providers",
      "Data/Compliance: (adhering org-level's needed if requesting analytics-data",
      "Privacy: no student's name sharing to third-party/carriers",
    ],
  },
];
export const setupSteps = [
  {
    number: "1",
    title: "Create classes",
    description: "class codes for quick joins or CSV roster import.",
    detail: "53.62 × 140",
  },
  {
    number: "2",
    title: "SSO (roadmap)",
    description: "Google/Microsoft sign-in to reduce password resets.",
  },
  {
    number: "3",
    title: "Device flexibility",
    description: "run on school PCs or tablets; VR optional.",
  },
];
export const testimonials = [
  {
    quote:
      "“Integrating Blue Sands STEM Labs into our school’s learning environment has been one of the best decisions we’ve made this year.”",
    author: "Mr. Henry Ogaga ",
    role: "Head of School, Paulson British International School",
  },
  {
    quote:
      "“Blue Sands STEM Labs has made teaching Chemistry much easier and more effective. The virtual experiments allow students to see reactions that we normally can’t perform due to safety or equipment limitations.”",
    author: "Mrs. Fatima Abdulahi ",
    role: "Chemistry Teacher",
  },
  {
    quote:
      "“Before Blue Sands STEM Labs, science felt overwhelming for me. But using the virtual labs helped me visualize every concept clearly.”",
    author: "Ayomide Olanrewaju ",
    role: "Female – SS2",
  },
];

export const tabContent = {
  students: {
    title: "STUDENTS",
    subtitle: "Discover, Explore, and Learn Without Limits",
    description:
      "Blue Sands STEM Labs gives students access to realistic, hands-on Physics, Chemistry, and Biology experiments anytime, anywhere, even without internet.",
    features: [
      "Experience science through immersive 3D virtual labs",
      "Build confidence and improve performance by repeating experiments safely",
      "Earn badges, track progress, and learn at your own pace",
      "Aligned with curricula mapped to WAEC/NECO/IGCSE curricula",
      "Badges, leaderboards & progress tracking for motivation",
    ],
    buttons: [{ text: "Start your learning journey", primary: true }],
    footer:
      "Accessible on PC & tablet. Works offline with sync when you're back online.",
    image: img("/home/learn/1.jpg"), // Update with actual filename
    cardTitle: "Why students love it",
    cardDescription:
      "Hands-on learning, instant feedback, and unlimited practice time, anytime, anywhere.",
    blogLink: "#",
  },
  teachers: {
    title: "TEACHERS",
    subtitle: "Transform Your Classroom with Interactive Tools",
    description:
      "Our intuitive teacher dashboard empowers educators to manage classes, monitor student progress, and deliver curriculum-aligned experiments with ease.",

    features: [
      "Access lesson plans and ready-to-use simulations.",
      "Get analytics and real-time feedback on student performance.",
      "Integrate VR/AR into your teaching without complex setup.",
      "Auto-graded quizzes & downloadable reports",
    ],

    buttons: [
      { text: "Enhance your lessons with Blue Sands STEM Labs", primary: true },
    ],
    footer:
      "Includes onboarding & support. Integrates with your timetable and LMS.",
    image: img("/home/learn/2.jpg"), // Update with actual filename
    cardTitle: "Teacher impacts",
    cardDescription:
      "Save prep time, boost engagement, and target support with data-driven insights.",
    blogLink: "#",
  },
  schools: {
    title: "SCHOOLS",
    subtitle: "Build the Future of STEM Education in Your Institution",
    description:
      "Blue Sands STEM Labs replaces costly, scarce lab setups with affordable, scalable virtual science labs.",

    features: [
      "Cut lab spend and upkeep by up to 70%.",
      "Ensure equitable, high-quality STEM access for all students.",
      "Prepare learners for real-world scientific work.",
      "Manage multi-seat licenses with a central admin dashboard.",
      "Use the Offline Lab Packager & Sync for low-connectivity areas.",
    ],
    buttons: [{ text: " Talk to our team", primary: true }],
    footer:
      "School outcomes Improve STEM results, attract parents, and standardize practices across the school.",
    image: img("/home/learn/2.jpg"),
    cardTitle: "School Outcomes",
    cardDescription:
      "Improve STEM results, attract parents and standardize practicals across the school.",
    blogLink: "#",
  },
};
export const articles = [
  {
    author: "Alec Whitten",
    date: "17 Jan 2025",
    title: "Bill Walsh leadership lessons",
    excerpt:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    image: img("/home/blog/1.jpg"),
    tags: ["Leadership", "Management"],
    link: "#",
  },
  {
    author: "Demi Wilkinson",
    date: "19 Jan 2022",
    title: "PM mental models",
    excerpt:
      "Mental models are simple expressions of complex processes or relationships.",
    image: img("/home/blog/2.jpg"),
    tags: ["Product", "Research", "Frameworks"],
    link: "#",
  },
  {
    author: "Candice Wu",
    date: "18 Jan 2022",
    title: "What is Wireframing?",
    excerpt:
      "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    image: img("/home/blog/3.jpg"),
    tags: ["Design", "Research"],
    link: "#",
  },
  {
    author: "Natali Craig",
    date: "14 Jan 2022",
    title: "How collaboration makes us better designers",
    excerpt:
      "Collaboration can make our teams stronger, and our individual designs better.",
    image: img("/home/blog/4.jpg"),
    tags: ["Design", "Research"],
    link: "#",
  },
  {
    author: "Drew Cano",
    date: "13 Jan 2022",
    title: "Our top 10 Javascript frameworks to use",
    excerpt:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    image: img("/home/blog/5.jpg"),
    tags: ["Software Development", "Tools", "SaaS"],
    link: "#",
  },
  {
    author: "Orlando Diggs",
    date: "17 Jan 2022",
    title: "Podcast: Creating a better CX Community",
    excerpt:
      "Starting a community doesn't need to be complicated, but how do you get started?",
    image: img("/home/blog/6.jpg"),
    tags: ["Podcasts", "Customer Success"],
    link: "#",
  },
];

export const team = [
  {
    name: "Alero Thompson",
    role: "Co-Founder/CEO",
    bio: "Co-Founder & CEO of Blue Sands Stem Labs and a standout voice in business, technology, and STEM education.",
    image: img("/ceo.jpeg"),
    bgColor: "from-purple-200 to-purple-100",
    social: {
      linkedin: "#",
    },
  },
  {
    name: "Kingsley Okechukwu",
    role: "Co-Founder/CTO",
    bio: "CTO at Blue Sands STEM Labs with 10+ years at the intersection of Information Technology and Marketing/Media Strategy.",
    image: img("/home/team/kingsley.jpg"),
    bgColor: "from-green-200 to-green-100",
    social: {
      linkedin: "#",
    },
  },
  {
    name: "WS Michael",
    role: "Head of HR",
    bio: "He leads people strategy and talent development, building high-performing teams and fostering a culture where individuals and the organization thrive together.",
    image: img("/home/team/mfoniso.jpg"),
    bgColor: "from-orange-200 to-orange-100",
    image: img("/home/team/michael.jpeg"),

    bgColor: "from-orange-200 to-orange-100",
    social: {
      linkedin: "#",
    },
  },

  {
    name: "Ifedayo (Michael) Adedeji",
    role: "Lead Solutions Architect",
    bio: "Seasoned 9+ years architect with experience across radar threats telemetry system, banking security, and fintech systems , now engineering the core architecture powering Blue Sands intelligent edtech system...",
    image: img("/home/team/ife.jpg"),
    bgColor: "from-blue-200 to-blue-100",
    social: {
      linkedin: "#",
    },
  },
  {
    name: "Chibueze Arisa",
    role: "Front-End Developer",
    bio: "Seasoned 9+ years architect with experience across radar threats telemetry system, banking security, and fintech systems , now engineering the core architecture powering Blue Sands intelligent edtech system...",
    image: img("/home/team/chibueze.jpg"),
    bgColor: "from-blue-200 to-blue-100",
    social: {
      linkedin: "#",
    },
  },
  {
    name: "Mfoniso Ibokette",
    role: "Lead Product designer",
    bio: "He designs end-to-end digital products that balance business goals with real user needs.",
    image: img("/home/team/mfoniso.jpg"),
    bgColor: "from-orange-200 to-orange-100",
    social: {
      linkedin: "#",
    },
  },
  {
    name: "Aboderin Daniel",
    role: "Frontend Developer",
    bio: "A passionate frontend developer focused on building clean, responsive, and performant user interfaces that bring products to life on the web.",
    image: img("/home/team/daniel.jpg"),
    bgColor: "from-teal-200 to-teal-100",
    social: {
      linkedin: "#",
    },
  },
];
export const challenges = [
  {
    title: "Infrastructure Gaps",
    description:
      "Many African universities struggle with outdated or non-existent laboratory facilities. Blue Sands provides state-of-the-art virtual labs accessible from any device.",
    image: img("/home/challenges/lab.jpg"),
  },
  {
    title: "Brain Drain Prevention",
    description:
      "Keep top talent in Africa by providing world-class educational tools that rival international institutions.",
    image: img("/home/challenges/brain.jpg"),
  },
  {
    title: "Rural Student Access",
    description:
      "Bridge the urban-rural divide with mobile-optimized virtual labs that work on low-bandwidth connections.",
    image: img("/home/challenges/rural.jpg"),
  },
  {
    title: "Curriculum Localization",
    description:
      "Content tailored to African contexts with locally relevant examples and case studies.",
    image: img("/home/challenges/curriculum.jpg"),
  },
  {
    title: "Large Class Sizes",
    description:
      "Scale quality education to thousands of students without compromising on hands-on learning.",
    image: img("/home/challenges/large-class.png"),
  },
  {
    title: "Maintenance-Free",
    description:
      "No expensive equipment maintenance, chemical supplies, or laboratory upkeep needed.",
    image: img("/home/challenges/maintenance.png"),
  },
];
export const slides = [
  {
    title: "Empowering Africa's Next Generation of STEM Innovators",
    description:
      "Bridging the digital divide with world-class virtual laboratory experiences. From Lagos to Cape Town, unlock limitless potential in Science, Technology, Engineering, and Mathematics.",
    image: img("/hero/1.jpg"),
    background: "primary",
    imageSize: "large", // options: "small", "medium", "large", "full"
  },
  {
    title:
      "Virtual & Augmented Reality in STEM Education for Secondary & Tertiary Schools.",
    description:
      "Virtual Science Labs offers students engaging STEM courses accessible on tablet or PC anywhere, anytime.",
    image: img("/hero/3.jpg"),
    background: "secondary",
    imageSize: "medium",
  },
  {
    title: "Unlock Potential in Your Classroom",
    description:
      "Transform your classroom with Blue Sands STEM Labs. Our virtual labs use VR and AR to give students practical, hands-on science experience, preparing them for a future in innovation.",
    image: img("/hero/2.png"),
    background: "primary",
    imageSize: "large",
  },
];
export const values = [
  {
    title: "Integrity",
    content:
      " We do the right thing even when no one is watching. Honesty, transparency, and accountability guide every decision we make.",
  },
  {
    title: "Excellence",
    content:
      "Good enough is not our standard. We aim for high-quality work, consistent execution, and continuous improvement in everything we do",
  },
  {
    title: "Innovation",
    content:
      "We believe in continuous improvement and learning. We encourage innovation, embrace challenges, and invest in the development of our team, our products, and our impact on education.",
  },
  {
    title: "People",
    content:
      "We challenge the status quo with bold ideas and practical solutions. Curiosity, creativity, and experimentation power how we solve real problems.",
  },
  {
    title: "Impact",
    content:
      "Our success is measured by the lives we transform and the futures we inspire.",
  },
];
export const speakers = [
  {
    name: "Alero Thompson",
    title: "Founder/CEO, BlueSands STEM Labs",

    image: img("/ceo.jpeg"),
  },
  {
    name: "Bukola Peter Chukwurah",
    title: "Co-Founder NEXT and Head Partnership, TECHNO",
    image: img("/speakers/bukola.jpg"),
  },
  {
    name: "Emmanuel Ezehiwele",
    title: "Tech Startup Ecosystem",
    image: img("/speakers/emmanuel.jpg"),
  },
  {
    name: "Habeebah Ibrahim",
    title: "Founder, Beebahtics",
    image: img("/speakers/habeebah.jpg"),
  },
  {
    name: "Kingsley Okechiukwu",
    title: "CTO, Blue Sands STEM Lab",
    image: img("/speakers/kingsley.jpg"),
  },
  {
    name: "Moses Ozoumeh",
    title:
      "Founder & CEO SignMe Technologies and Fitchild Sport Education Limited ",
    image: img("/speakers/moses.png"),
  },
  {
    name: "Peter Obetoh",
    title:
      "3D artist, animator, and XR developer specializing in real-time 3D, VR/AR.",
    image: img("/speakers/peter.jpg"),
  },
  {
    name: "Chiaku Unegbu",
    title: "Tech Educator",
    image: img("/speakers/chiaku.jpg"),
  },
  {
    name: "Emmanuel Adefolaju",
    title: "Training & Program Manager at Winbox Consulting",
    image: img("/speakers/emmanuel-a.jpg"),
  },
  {
    name: "Juma Aisha",
    title: "Lead Data Instructor at Nebiant Analytics",
    image: img("/speakers/juma.jpg"),
  },
  {
    name: "Oluwaseyi Francis Ayodele",
    title:
      "Community Manager for the 3 Million Technical Talent (3MTT) Program in Lagos",
    image: img("/speakers/seyi.jpg"),
  },
];
// lib/features-data.js

export const featuresData = [
  {
    id: 1,
    title: "Educational Institutions",
    description:
      "We work with primary, secondary, and tertiary schools to deploy Blue Sands STEM Labs across classrooms, labs, and remote learning environments. Benefits include:",
    image: img("/partnerships/2.jpg"),
    keyPoints: [
      "Access to full virtual lab modules in Physics, Chemistry, and Biology.",
      "Teacher dashboards, analytics, and reporting tools.",
      "Offline Lab Packager for low-connectivity areas.",
      "Custom onboarding and support.",
    ],
  },
  {
    id: 2,
    title: "Government & Policy Makers",
    description:
      "We collaborate with education ministries, state boards, and NGOs driving STEM inclusion, teacher development, and digital equity initiatives. Areas of collaboration:",
    image: img("/partnerships/3.jpg"),
    keyPoints: [
      "State and national educational project",
      "Rural school science lab deployment",
      "Teacher and trainer certification programs",
      "Monitoring and evaluation partnerships",
    ],
  },
  {
    id: 3,
    title: "Technology & Research Partners",
    description:
      "We partner with leading EdTech companies, hardware providers, and research institutions to enhance performance, accessibility, and reach. Focus areas:",
    image: img("/partnerships/4.jpg"),
    keyPoints: [
      "AI-driven student analytics",
      "Cloud and offline integration",
      "Device optimization for low-spec environments",
      "Curriculum localization and data interoperability",
    ],
  },
  {
    id: 4,
    title: " Investors, Accelerators & Impact Partners",
    description:
      "Our growth is powered by visionary investors and impact funds who believe in education as a catalyst for change. We welcome partners who seek to:",
    image: img("/partnerships/5.jpg"),
    keyPoints: [
      "Drive sustainable education models in Africa.",
      "Fund innovation in EdTech and VR/AR learning.",
      "Support research and product development.",
      "Scale educational impact across regions.",
    ],
  },
];

export const cards = [
  {
    icon: img("/home/space-icon.png"),
    title: "Our Vision",
    description:
      "To become Africa's leading digital science and technology education ecosystem, empowering a generation of young innovators who will solve the continent's most pressing challenges through STEM.",
  },
  {
    icon: img("/home/plane-icon.png"),
    title: "Our Mission",
    description:
      "To democratize access to quality science education by integrating immersive technology, creative learning methods, and data-driven insights into classrooms and communities across Africa.",
  },
  {
    icon: img("/home/plant-icon.png"),
    title: "Our Purpose",
    description:
      "We exist to bridge the educational divide in science and technology, empowering schools with digital tools that spark curiosity, creativity, and problem-solving skills in learners.",
  },
];
export const partners = [
  {
    id: 3,
    name: "BSA Business Cards",
    domain: "https://www.24pagesafrica.com/",
    logo: img("/partners/bsa.png"),
  },
  {
    id: 4,
    name: "EDUSTART",
    domain: "https://www.24pagesafrica.com/",
    logo: img("/partners/edustart.png"),
  },
  {
    id: 5,
    name: "Lagos State Science Research and Innovation Council (LASRIC)",
    domain: "https://www.24pagesafrica.com/",
    logo: img("/partners/lasric.jpg"),
  },
  {
    id: 6,
    name: "NITDA",
    domain: "https://www.24pagesafrica.com/",
    logo: img("/partners/nitda.png"),
  },
  {
    id: 7,
    name: "ReLearn",
    domain: "https://www.24pagesafrica.com/",
    logo: img("/partners/relearn.png"),
  },
  {
    id: 8,
    name: "BlueSandAcademy",
    domain: "https://www.24pagesafrica.com/",
    logo: img("/partners/bluesand.jpg"),
  },
];
export const articles2 = [
  {
    image: img("/blog/2.jpg"),
    author: "Blue Sands Academy",
    date: "17 Jan 2025",
    title: "Lesson Ideas",
    description:
      "Short, classroom-ready sequences built around one simulation. Includes objectives, timing, printable worksheet, and assessment suggestions.",
    tags: [
      { label: "Leadership", color: "primary" },
      { label: "Management", color: "gray" },
    ],
    link: "#",
  },
  {
    image: img("/blog/2.jpg"),

    author: "Blue Sands Academy",
    date: "17 Jan 2025",
    title: "Assessment & Analytics",
    description:
      "How to use auto-graded items, item analysis, mastery views, and evidence packs to improve teaching and exam prep.",
    tags: [
      { label: "Leadership", color: "primary" },
      { label: "Management", color: "gray" },
    ],
    link: "#",
  },
  {
    image: img("/blog/3.jpg"),

    author: "Candice Wu",
    date: "15 Jan 2022",
    title: "Connectivity & Access",
    description:
      "Offline-first tactics for low/spotty internet environments: caching, device rotation, content pack scheduling.",
    tags: [
      { label: "Design", color: "primary" },
      { label: "Research", color: "gray" },
    ],
    link: "#",
  },
  {
    image: img("/blog/4.jpg"),

    author: "Natali Craig",
    date: "14 Jan 2022",
    title: "How collaboration makes us better designers",
    description:
      "Collaboration can make our teams stronger, and our individual designs better.",
    tags: [
      { label: "Design", color: "primary" },
      { label: "Research", color: "gray" },
    ],
    link: "#",
  },
  {
    image: img("/blog/5.jpg"),

    author: "Drew Cano",
    date: "13 Jan 2022",
    title: "Case Studies",
    description:
      "Pilot results and stories from secondary and tertiary contexts—what worked, what to avoid, and measurable impact",
    tags: [
      { label: "Software Development", color: "green" },
      { label: "Tools", color: "purple" },
      { label: "SaaS", color: "pink" },
    ],
    link: "#",
  },
  {
    image: img("/blog/6.jpg"),

    author: "Orlando Diggs",
    date: "12 Jan 2022",
    title: "Product Updates",
    description:
      "New simulations, features, content packs, and roadmap highlights.",
    tags: [
      { label: "Podcasts", color: "primary" },
      { label: "Customer Success", color: "gray" },
    ],
    link: "#",
  },
];
export const stats = [
  {
    country: "Nigeria",
    stat: "65%",
    flagCode: "ng",
    text: "of Nigerian secondary schools lack adequate lab infrastructure",
  },
  {
    country: "Ghana",
    stat: "60%",
    flagCode: "gh",
    text: "of Ghanian secondary schools lack adequate lab infrastructure",
  },
  {
    country: "Rwanda",
    stat: "74.5%",
    flagCode: "rw",
    text: "of Rwandan secondary schools lack adequate lab infrastructure",
  },
  {
    country: "Kenya",
    stat: "45%",
    flagCode: "ke",
  },
  {
    country: "South Africa",
    stat: "70%",
    flagCode: "za",
  },
  {
    country: "Uganda",
    stat: "70%",
    flagCode: "ug",
  },
];
export const statistics = [
  {
    percentage: "90%",
    description:
      "of African secondary schools lack appropriate science laboratory facilities",
  },
  {
    percentage: "91%",
    description:
      "African university respondents reported insufficient equipment for hands-on training.",
  },
  {
    percentage: "40-50%",
    description:
      "higher student engagement with virtual labs in African secondary schools",
  },
  {
    percentage: "$50k+",
    description: "Average cost savings per institution annually",
  },
];
export const coursesData = [
  {
    id: 1,
    title:
      "Biology: Enzyme Activity, Diffusion & Osmosis, Photosynthesis Rates, Genetics: Punnett Squares",
    description:
      "In this simulation, you will step into the Anatomy and Physiology lab to discover how essential your intestines are in maintaining human life. Investigate what happens if your intestines malfunction and learn why you really need to eat your veggies!",
    image: img("/simulations/bio.png"),
    duration: "22 Min",
    tags: ["Health Sciences", "Biology", "Higher Education"],
    category: "Biology",
    courseType: "High School Biology",
  },
  {
    id: 2,
    title:
      "Chemistry: Acid-Base Titration, Rates of Reaction, Electrolysis, Gas Laws",
    description:
      "In this simulation, you will step into the Anatomy and Physiology lab to discover how essential your intestines are in maintaining human life. Investigate what happens if your intestines malfunction and learn why you really need to eat your veggies!",
    image: img("/simulations/chem.png"),
    duration: "22 Min",
    tags: ["Health Sciences", "Biology", "Higher Education"],
    category: "Chemistry",
    courseType: "High School Chemistry",
  },
  {
    id: 3,
    title: "Physics: Newton's Laws, Energy Conservation, Wave Properties",
    description:
      "Explore fundamental physics concepts through interactive simulations. Understand motion, forces, energy transformations, and wave behavior through hands-on virtual experiments.",
    image: img("/simulations/bio.png"),
    duration: "25 Min",
    tags: ["Physics", "Higher Education", "AP Physics"],
    category: "Physics",
    courseType: "AP Chemistry",
  },
  {
    id: 4,
    title: "Ecology: Food Webs, Population Dynamics, Ecosystem Balance",
    description:
      "Investigate ecological relationships and understand how organisms interact within ecosystems. Learn about energy flow, population growth, and environmental factors affecting biodiversity.",
    image: img("/simulations/chem.png"),
    duration: "20 Min",
    tags: ["Biology", "Ecology", "Environmental Science"],
    category: "Biology",
    courseType: "Ecology",
  },
  {
    id: 5,
    title: "Evolution: Natural Selection, Genetic Drift, Speciation Mechanisms",
    description:
      "Discover the mechanisms of evolution through interactive simulations. Observe natural selection in action, understand genetic variation, and explore how new species arise over time.",
    image: img("/simulations/bio.png"),
    duration: "30 Min",
    tags: ["Biology", "Evolution", "Genetics"],
    category: "Biology",
    courseType: "Evolution",
  },
  {
    id: 6,
    title: "Food Science: Nutritional Analysis, Food Chemistry, Microbiology",
    description:
      "Explore the science behind food and nutrition. Analyze nutritional content, understand food chemistry principles, and investigate microbial growth in food systems.",
    image: img("/simulations/chem.png"),
    duration: "18 Min",
    tags: ["Food Science", "Chemistry", "Health Sciences"],
    category: "Chemistry",
    courseType: "Food Science and Nutrition",
  },
];
