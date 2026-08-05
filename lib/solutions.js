// School-technology solutions: the Smart Blackboard and the Virtual Science Lab
// Tablet. These live in their own module, NOT in `lib/products.js`, because that
// array is the ARpedia book catalogue and is consumed by the preorder quantity
// picker, the Paystack cart mapping (lib/paystack-orders.js), the home pricing
// band and the "Meet the Books" teaser. Every one of those assumes an age range,
// a one-off NGN price and a per-kit Paystack line item. A quoted-per-classroom
// display and a tablet bundled free with a kit fit none of that, so they are
// kept apart and only the /products/[slug] route, the sitemap and the SEO
// builders read both.
//
// URLs still live under /products/<slug> so the shop keeps one address space.
import {
  Atom,
  Backpack,
  Bot,
  BookOpen,
  Boxes,
  ChartColumn,
  ClipboardList,
  Cloud,
  Code,
  Dna,
  FlaskConical,
  Globe,
  Hand,
  Highlighter,
  House,
  LayoutDashboard,
  LibraryBig,
  ListChecks,
  Monitor,
  PenLine,
  PlayCircle,
  Presentation,
  School,
  ScreenShare,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// PRICING
// The blackboard is quoted per installation (screen size, mounting, training),
// so no figure is published yet: `mode: "coming-soon"` renders a placeholder
// instead of a number. The Virtual Science Lab Tablet is no longer sold as its
// own per-student subscription: `mode: "bundled"` means it ships free with
// every AR Book kit (see lib/products.js), so it carries no standalone price.
// ─────────────────────────────────────────────────────────────────────────────

export const solutions = [
  {
    slug: "smart-blackboard",
    name: "Smart Blackboard",
    kicker: "Classroom Display",
    color: "#0483e2",
    tagline: "Turn every classroom into an interactive lesson.",
    blurb: "An interactive display that replaces the chalkboard.",
    description:
      "The Blue Sands Smart Blackboard combines the familiarity of a traditional classroom board with modern interactive technology. Built for K-12 teaching, it gives teachers one surface for presenting lessons, working through problems with students, and pulling in digital resources without leaving the board.",
    description2:
      "Whether the lesson is Mathematics, Science, Languages, Arts or Coding, teachers can make it more visual and more hands-on for the whole class.",
    hero: {
      src: "/real-products/smart-blackboard.jpeg",
      w: 1152,
      h: 864,
      alt: "A teacher at a Smart Blackboard showing graphs and 3D geometry while students raise their hands",
    },
    gallery: [
      {
        src: "/real-products/smart-blackboard-2.png",
        w: 1024,
        h: 1536,
        alt: "Students in a Nigerian classroom following a Mathematics lesson on the Smart Blackboard",
      },
    ],
    price: {
      mode: "coming-soon",
      note: "Quoted per classroom, including mounting and teacher training.",
    },

    // Three hard facts for the hero, drawn from the client's brief. No social
    // proof anywhere on these pages: Blue Sands has not sold a unit yet, so
    // there are no schools, numbers or quotes to cite, and inventing them is
    // exactly the credibility risk AGENTS.md warns about.
    heroHighlights: [
      { value: "Multi-touch", label: "Several students write at once" },
      { value: "Save & export", label: "Every board kept for revision" },
      { value: "Call-ready", label: "Remote classes join the lesson" },
    ],

    // Hotspot coordinates are percentages measured against the real pixels of
    // smart-blackboard.jpeg (1152x864). Each one points at something actually
    // visible in the photo, so the feature list is anchored to the product
    // rather than floating beside it.
    lessonView: {
      kicker: "See it in use",
      title: "One board, four things happening at once",
      body: "This is a single Mathematics lesson. Tap a marker to see what the board is doing at that moment.",
      hotspots: [
        {
          x: 56,
          y: 44,
          title: "Two students at the board",
          detail:
            "The display takes several touches at once, so two students can work through different parts of a problem while the class watches. No waiting for a turn at the chalk.",
        },
        {
          x: 62,
          y: 32,
          title: "A solid you can turn around",
          detail:
            "The cube and sphere are a 3D model, not a drawing. Rotate it, slice it, and the class sees the cross-section from every angle instead of imagining it.",
        },
        {
          x: 84,
          y: 35,
          title: "Graphs drawn live",
          detail:
            "Plot y = sin x and y = x² − 2 together, then annotate straight over them in digital ink to mark the intersections.",
        },
        {
          x: 70,
          y: 50,
          title: "The teaching toolbar",
          detail:
            "Pen, eraser, shapes, text, undo and redo sit on the board itself. The teacher never turns to a laptop mid-explanation.",
        },
      ],
    },

    faqs: [
      {
        q: "Do teachers have to learn new software?",
        a: "The board is written on the way a chalkboard is. Pick up the pen and write, highlight, or erase. The extras that are not on a chalkboard, saving and exporting a lesson, are single actions on the toolbar.",
      },
      {
        q: "Can we use the lesson material we already have?",
        a: "Yes. Images, videos, audio, presentations, PDFs, educational websites and interactive simulations all open on the board, and teachers can annotate over any of them.",
      },
      {
        q: "Can students in another building or at home join the lesson?",
        a: "The board works with the common video conferencing platforms, so a second classroom, another campus, or a student at home can join and still take part in what is happening on the board.",
      },
      {
        q: "Which subjects does it suit?",
        a: "It is built for K-12 teaching generally: Mathematics, Science, Languages, Arts and Coding. It is strongest in STEM, where virtual laboratory demonstrations, engineering diagrams, mathematical visualisation, robotics lessons and 3D simulations all run on it.",
      },
      {
        q: "Does it work with the rest of the Blue Sands setup?",
        a: "Yes. It connects to the Learning Management System, STEM laboratory solutions, robotics and AI kits, the coding curriculum, the digital content library, assessment and analytics, and the teacher development programme.",
      },
      {
        q: "What does it cost?",
        a: "Pricing is not published yet. The board is quoted per classroom because the figure depends on screen size, mounting and how much teacher training a school wants. Book a demonstration and we will quote your rooms.",
      },
    ],

    outcomes: {
      kicker: "Why schools choose it",
      title: "Lessons students take part in",
      body: "Students learn more when they can work on the board themselves, compare answers with their classmates, and see whether they got it right straight away. The Smart Blackboard helps schools:",
      items: [
        "Run lessons students take part in, not just watch",
        "Raise participation across the whole class",
        "Support blended and hybrid teaching",
        "Cut spending on printed handouts",
        "Bring digital content into ordinary lessons",
        "Get groups working together at the board",
      ],
    },

    featureGroups: [
      {
        Icon: Hand,
        title: "Multi-Touch Display",
        body: "Several students and the teacher can write, draw and annotate on the board at the same time, by hand or with a digital pen.",
      },
      {
        Icon: PenLine,
        title: "Digital Whiteboard",
        body: "Build notes, diagrams, equations, flowcharts and illustrations as naturally as writing on a board.",
        items: [
          "Write in digital ink",
          "Highlight the parts that matter",
          "Erase without smudging",
          "Save the board as it stands",
          "Export the lesson for later",
        ],
      },
      {
        Icon: PlayCircle,
        title: "Multimedia in the Lesson",
        body: "Open teaching material without stopping to set anything up.",
        items: [
          "Images",
          "Videos",
          "Audio",
          "Presentations",
          "PDFs",
          "Educational websites",
          "Interactive simulations",
        ],
      },
      {
        Icon: ScreenShare,
        title: "Wireless Screen Sharing",
        body: "Students and teachers can share their screen from a laptop, tablet or phone straight to the board.",
        items: [
          "Student presentations",
          "Group discussions",
          "Project demonstrations",
          "Work reviewed together",
        ],
      },
      {
        Icon: Highlighter,
        title: "Annotate Anything",
        body: "Mark up whatever is on screen, then keep the marked-up copy for revision or send it to the class.",
        items: ["Websites", "Videos", "Documents", "Images", "Presentations"],
      },
      {
        Icon: Cloud,
        title: "Cloud Storage",
        body: "Teachers reach cloud teaching resources from the board and save lesson material securely, then organise it and reuse it with the next class.",
      },
      {
        Icon: Video,
        title: "Video Conferencing Ready",
        body: "Works with the common video conferencing platforms, so a remote class or a second campus can join the same lesson and still take part on the board.",
      },
      {
        Icon: Users,
        title: "Group Work at the Board",
        body: "Turn the board into shared workspace for the class.",
        items: [
          "Group problem-solving",
          "Brainstorming sessions",
          "Interactive quizzes",
          "Collaborative projects",
          "Student-led presentations",
        ],
      },
    ],

    spotlight: {
      Icon: FlaskConical,
      kicker: "Built for STEM",
      title: "Practical science on a screen the whole class can see",
      body: "The Smart Blackboard fits STEM teaching in particular, and works alongside the rest of the Blue Sands STEM range to make practical lessons easier to run.",
      items: [
        "Virtual laboratory demonstrations",
        "Interactive science experiments",
        "Engineering diagrams",
        "Mathematical visualisation",
        "Coding instruction",
        "Robotics lessons",
        "3D models and simulations",
      ],
    },

    audienceBenefits: {
      kicker: "What it changes day to day",
      title: "For teachers and for students",
      groups: [
        {
          Icon: Presentation,
          title: "For teachers",
          items: [
            "Prepare lessons faster",
            "Present without fighting the equipment",
            "Save teaching material and reuse it",
            "Spend less time on admin",
            "Get more of the class involved",
            "Reach digital resources on the spot",
            "Explain hard ideas by showing them",
          ],
        },
        {
          Icon: Backpack,
          title: "For students",
          items: [
            "Take part instead of watching",
            "See the concept, not just the words",
            "Work with classmates in real time",
            "Handle the digital tools themselves",
            "Stay engaged through the lesson",
            "Remember more of what was taught",
          ],
        },
      ],
    },

    environments: {
      kicker: "Where it fits",
      title: "Rooms it was built for",
      items: [
        "Primary Schools",
        "Secondary Schools",
        "STEM Laboratories",
        "Computer Laboratories",
        "Innovation Hubs",
        "Science Classrooms",
        "Mathematics Classrooms",
        "Technical Colleges",
        "Teacher Training Centres",
      ],
    },

    ecosystem: {
      kicker: "Part of the Blue Sands digital classroom",
      title: "It connects to the rest of what we build",
      body: "The Smart Blackboard works with the other Blue Sands education products, so a school that adds more than one gets a single connected setup rather than separate tools.",
      items: [
        { Icon: LayoutDashboard, label: "Learning Management System" },
        { Icon: FlaskConical, label: "STEM Laboratory Solutions" },
        { Icon: Bot, label: "Robotics and AI Kits" },
        { Icon: Code, label: "Coding Curriculum" },
        { Icon: LibraryBig, label: "Digital Content Library" },
        { Icon: ChartColumn, label: "Assessment and Analytics" },
        { Icon: Presentation, label: "Teacher Professional Development" },
      ],
    },

    cta: {
      title: "See it in a real classroom",
      body: "Book a demonstration and we will show you the Smart Blackboard running a full lesson, or talk it through with one of our education technology specialists.",
    },
  },

  {
    slug: "virtual-science-lab-tablet",
    name: "Virtual Science Lab Tablet",
    kicker: "Tablet + Virtual Science Labs",
    color: "#9B5DE5",
    tagline: "A science laboratory every student can carry.",
    // No price in the blurb: it renders directly above the price on the landing
    // page and shop cards. `solutionMetaTitle` already carries the figure for
    // search results, so nothing is lost by keeping it out here.
    blurb:
      "A science laboratory with 300 simulations every student can practise.",
    description:
      "The Virtual Science Lab Tablet puts a working science laboratory in every student's hands. It pairs a learning tablet with a library of interactive experiments, STEM simulations, digital textbooks, an AI study assistant and the classroom tools teachers need to run it all.",
    description2:
      "It is built for primary and secondary schools, so students can run experiments, get them wrong, and try again in a setting that is safe and costs nothing per attempt.",
    hero: {
      src: "/real-products/smart-tablet-1.png",
      w: 1024,
      h: 1024,
      alt: "A student holding the tablet with the Virtual Science Lab open, science equipment illustrated above the screen",
    },
    gallery: [
      {
        src: "/real-products/smart-tablet-1.png",
        w: 1024,
        h: 1024,
        alt: "Two students in lab coats running a chemical reactions experiment on the Virtual Science Lab app",
      },
    ],
    price: {
      mode: "bundled",
      bundledWith: "every AR Book kit",
      note: "No separate subscription: every AR Book kit ships with a Smart Tablet that already has the Virtual Science Lab on it.",
      includes: [
        "Smart Tablet learning platform",
        "Unlimited access to the Virtual Science Labs",
        "Interactive STEM simulations",
        "Digital textbooks and learning resources",
        "Learning Management System access",
        "Teacher classroom management tools",
        "Student assessments and progress tracking",
        "Automatic software updates",
        "Technical support",
      ],
    },

    heroHighlights: [
      { value: "27", label: "Topic areas across 4 sciences" },
      { value: "9", label: "Subjects in the textbook library" },
      { value: "Included", label: "With every AR Book kit" },
    ],

    faqs: [
      {
        q: "What does the Virtual Science Lab Tablet include?",
        a: "The tablet learning platform, unlimited access to the Virtual Science Labs, the STEM simulations, digital textbooks, Learning Management System access, the teacher dashboard, student assessments, progress analytics, cloud storage, software updates and technical support. All of it ships with the Smart Tablet in every AR Book kit, with nothing extra to buy.",
      },
      {
        q: "Do we still need laboratory equipment?",
        a: "Not for the experiments that run in the Virtual Science Labs. Students perform them in a digital environment, so there is no glassware to break and no consumables to replace each term. A titration can be run and re-run as many times as a student needs.",
      },
      {
        q: "Can students keep working at home?",
        a: "Yes. The tablet is built for classroom, home and hybrid timetables, and keeps working through school closures. Assignments, textbooks and lessons stay available, and teachers can still see progress and give feedback.",
      },
      {
        q: "Is it safe for children?",
        a: "Student accounts are secure, classrooms are teacher-controlled, content is age-appropriate, browsing is restricted to a safe environment, and the platform ships regular security updates with data privacy protection.",
      },
      {
        q: "How do teachers keep track of a whole class?",
        a: "From one dashboard. Teachers assign homework, share lesson materials, monitor progress, grade assessments, give feedback, track attendance, view learning analytics and message students, all in the same place.",
      },
      {
        q: "Which subjects are covered?",
        a: "The science labs cover Physics, Chemistry, Biology and Earth & Environmental Science. The wider textbook library adds Mathematics, English Language, Technology, Coding, Robotics, Engineering, Artificial Intelligence and STEM project guides.",
      },
    ],

    outcomes: {
      kicker: "One device, the whole school day",
      title: "What a student can do with it",
      body: "This is a complete digital classroom built for K-12, not a general-purpose tablet with school apps added on. Learning carries on at home as well as in class.",
      items: [
        "Run virtual science experiments",
        "Complete assignments",
        "Read digital textbooks",
        "Watch lesson videos",
        "Sit quizzes",
        "Join live classes",
        "Practise coding",
        "Learn robotics concepts",
        "Work with classmates",
        "Get feedback from the teacher",
      ],
    },

    labs: {
      kicker: "Virtual Science Laboratories",
      title: "Practical science without the equipment bill",
      body: "Students perform experiments in a safe digital environment, with no laboratory glassware to break and no consumables to replace. Four disciplines, with the topics your syllabus already covers.",
      disciplines: [
        {
          Icon: Atom,
          name: "Physics",
          accent: "#0483e2",
          topics: [
            "Electricity",
            "Motion",
            "Forces",
            "Magnetism",
            "Energy",
            "Waves",
            "Optics",
          ],
        },
        {
          Icon: FlaskConical,
          name: "Chemistry",
          accent: "#9B5DE5",
          topics: [
            "Chemical reactions",
            "Acids and bases",
            "Periodic table investigations",
            "Molecular structures",
            "Laboratory techniques",
            "Titration simulations",
            "Solutions and mixtures",
          ],
        },
        {
          Icon: Dna,
          name: "Biology",
          accent: "#3DD68C",
          topics: [
            "Human anatomy",
            "Cells and microorganisms",
            "Genetics",
            "Ecology",
            "Plant biology",
            "Body systems",
            "Microscopy simulations",
          ],
        },
        {
          Icon: Globe,
          name: "Earth & Environmental Science",
          accent: "#F0A202",
          topics: [
            "Climate",
            "Weather systems",
            "Rocks and minerals",
            "Ecosystems",
            "Renewable energy",
            "Environmental conservation",
          ],
        },
      ],
    },

    featureGroups: [
      {
        Icon: Boxes,
        title: "Lessons Students Work Through",
        body: "Every lesson comes with something to do, not just something to read.",
        items: [
          "Interactive simulations",
          "3D scientific models",
          "Animated explanations",
          "Virtual experiments",
          "Practice exercises",
          "Instant quizzes",
          "Gamified learning activities",
        ],
      },
      {
        Icon: Bot,
        title: "AI Learning Assistant",
        body: "Every student gets a study assistant that supports the teacher rather than replacing them.",
        items: [
          "Explain difficult concepts",
          "Answer academic questions",
          "Give step-by-step guidance",
          "Recommend further reading",
          "Help revise for examinations",
          "Support independent study",
        ],
      },
      {
        Icon: BookOpen,
        title: "Digital Textbooks and Resources",
        body: "A library that keeps growing all year round.",
        items: [
          "Science",
          "Mathematics",
          "English Language",
          "Technology",
          "Coding",
          "Robotics",
          "Engineering",
          "Artificial Intelligence",
          "STEM project guides",
        ],
      },
      {
        Icon: LayoutDashboard,
        title: "Teacher Dashboard",
        body: "Teachers run every student's learning from one screen.",
        items: [
          "Assign homework",
          "Share lesson materials",
          "Monitor student progress",
          "Grade assessments",
          "Give feedback",
          "Track attendance",
          "View learning analytics",
          "Message students",
        ],
      },
      {
        Icon: ClipboardList,
        title: "Learning Management System",
        body: "The tablet connects to the Blue Sands LMS, so records stay in one place.",
        items: [
          "Deliver online lessons",
          "Upload assignments",
          "Manage examinations",
          "Track performance",
          "Generate reports",
          "Organise learning resources",
          "Monitor school-wide progress",
        ],
      },
      {
        Icon: House,
        title: "Works Away from School",
        body: "Access to lessons holds up in the classroom, at home, in a hybrid timetable and through a school closure.",
      },
      {
        Icon: ShieldCheck,
        title: "Safe for Students",
        body: "Built for schools, with the controls parents and head teachers ask about.",
        items: [
          "Secure student accounts",
          "Teacher-controlled classrooms",
          "Age-appropriate content",
          "Safe browsing environment",
          "Data privacy protection",
          "Regular security updates",
        ],
      },
    ],

    audienceBenefits: {
      kicker: "Who it helps",
      title: "Schools, teachers and parents",
      groups: [
        {
          Icon: School,
          title: "For schools",
          items: [
            "Spend less on laboratory equipment",
            "Give every student practical science",
            "Improve STEM results",
            "Modernise classroom teaching",
            "Manage digital learning in one place",
            "Support competency-based education",
            "Prepare students for science and technology careers",
          ],
        },
        {
          Icon: Presentation,
          title: "For teachers",
          items: [
            "Deliver lessons students stay with",
            "Show hard concepts instead of describing them",
            "Cut lesson preparation time",
            "Assess students on the spot",
            "Track individual progress",
            "Set different work for different levels",
            "Get students working together",
          ],
        },
        {
          Icon: Users,
          title: "For parents",
          items: [
            "Solid educational content at home",
            "Science their child can actually do",
            "Safe digital learning tools",
            "Support tuned to their child",
            "Progress they can see",
            "Classroom material available from home",
          ],
        },
      ],
    },

    environments: {
      kicker: "Who it is for",
      title: "Schools and programmes it suits",
      items: [
        "Primary Schools",
        "Secondary Schools",
        "International Schools",
        "STEM Schools",
        "Private Schools",
        "Government Schools",
        "Homeschool Programs",
        "After-School Learning Centres",
      ],
    },

    checklist: {
      Icon: ListChecks,
      kicker: "What's included",
      title: "Every AR Book kit includes",
      items: [
        "Smart Tablet learning platform",
        "Virtual Science Labs",
        "Interactive STEM simulations",
        "AI Learning Assistant",
        "Digital textbooks",
        "Learning Management System access",
        "Teacher dashboard",
        "Student assessments",
        "Progress analytics",
        "Cloud storage",
        "Software updates",
        "Technical support",
      ],
    },

    ecosystem: {
      kicker: "Part of the Blue Sands digital classroom",
      title: "It connects to the rest of what we build",
      body: "The tablet works with the other Blue Sands education products, so a school running more than one gets a single connected setup rather than separate tools.",
      items: [
        {
          Icon: Monitor,
          label: "Smart Blackboard",
          href: "/products/smart-blackboard",
        },
        { Icon: FlaskConical, label: "STEM Laboratory Solutions" },
        { Icon: Bot, label: "Robotics and Coding Kits" },
        { Icon: Boxes, label: "AI Learning Platform" },
        { Icon: LayoutDashboard, label: "Learning Management System" },
        { Icon: LibraryBig, label: "Digital Content Library" },
        { Icon: Presentation, label: "Teacher Professional Development" },
      ],
    },

    cta: {
      title: "Put a science lab in every student's hands",
      body: "Book a demonstration, request a quotation, or talk through what a school-wide rollout would look like for your student numbers.",
    },
  },
];

export function getSolution(slug) {
  return solutions.find((s) => s.slug === slug) || null;
}

export const isSolution = (slug) => solutions.some((s) => s.slug === slug);
