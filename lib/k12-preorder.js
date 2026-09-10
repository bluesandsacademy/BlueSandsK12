// Blue Sands K12 platform pre-order: shared option lists and the pure
// validator used by both the API route and its unit tests. Keep the option
// ids stable. They are written to the k12_platform_preorders table verbatim.

export const SCHOOL_TYPES = [
  { id: "nursery_primary", label: "Nursery / Primary" },
  { id: "secondary", label: "Secondary" },
  { id: "k12", label: "K-12" },
  { id: "international", label: "International School" },
  { id: "other", label: "Other" },
];

// The four things a school can pre-order: the three ARpedia book packages and
// the Virtual Science Lab Tablet. `id` matches the /products/<slug> route so a
// package always resolves to a real catalogue page. `image` / `imageW` /
// `imageH` come straight from lib/products.js and lib/solutions.js. The picker
// shows the picture; `ageRange`, `books`, `topics` and `includes` are the
// details rendered under the selected card.
export const PREORDER_PACKAGES = [
  {
    id: "into-the-community",
    label: "Into the Community",
    image: "/products/into-the-community.png",
    imageW: 605,
    imageH: 561,
    ageRange: "Ages 4 to 7",
    books: "5 interactive AR books",
    topics: ["People and places", "Everyday environments", "Read-along stories"],
    includes: ["Smart Tablet", "Spotty Camera", "Marker Set", "AR Pedia app"],
  },
  {
    id: "into-the-curiosity-q",
    label: "Into the Curiosity Q",
    image: "/products/into-the-curiosity-q.png",
    imageW: 629,
    imageH: 605,
    ageRange: "Ages 5 to 9",
    books: "10 interactive AR books",
    topics: ["Universal knowledge", "Everyday questions in AR", "See, touch, interact"],
    includes: ["Smart Tablet", "Spotty Camera", "Marker Set", "AR Pedia app"],
  },
  {
    id: "ar-science-lab-full-kit",
    label: "AR Science Lab",
    image: "/products/ar-science-lab-full-kit.png",
    imageW: 628,
    imageH: 536,
    ageRange: "Ages 8 to 13",
    books: "8 AR science books, 130 experiments",
    topics: ["Biology", "Chemistry", "Physics", "Earth science"],
    includes: ["Smart Tablet", "Spotty Camera", "Marker Set", "AR Pedia app"],
  },
  {
    id: "virtual-science-lab-tablet",
    label: "Virtual Science Lab Tablet",
    image: "/real-products/smart-tablet-1.png",
    imageW: 1024,
    imageH: 1024,
    ageRange: "Primary and Secondary",
    books: "Digital textbook library across 9 subjects",
    topics: [
      "250+ science simulations",
      "Physics, Chemistry, Biology, Earth science",
      "AI study assistant",
      "Teacher dashboard and LMS",
    ],
    includes: [
      "Smart Tablet (optional)",
      "Virtual Science Labs",
      "STEM simulations",
      "Digital textbooks",
    ],
  },
];

export const SUBSCRIPTION_DURATIONS = [
  { id: "termly", label: "Termly" },
  { id: "annual", label: "Annual" },
  { id: "multi_year", label: "Multi-year" },
];

export const ACADEMIC_YEAR_OPTIONS = [
  { id: "current", label: "Current academic year" },
  { id: "next", label: "Next academic year" },
];

const SCHOOL_TYPE_IDS = SCHOOL_TYPES.map((t) => t.id);
const PACKAGE_IDS = PREORDER_PACKAGES.map((t) => t.id);
const DURATION_IDS = SUBSCRIPTION_DURATIONS.map((t) => t.id);
const ACADEMIC_YEAR_IDS = ACADEMIC_YEAR_OPTIONS.map((t) => t.id);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isBlank = (v) => !v || !String(v).trim();
const asArray = (v) => (Array.isArray(v) ? v : []);

/**
 * Validate a K12 platform pre-order payload.
 * Returns { valid, errors } where errors is keyed by field name. A valid
 * payload has an empty errors object.
 */
export function validateK12Preorder(body = {}) {
  const errors = {};

  if (isBlank(body.school_org_name))
    errors.school_org_name = "School or organisation name is required.";
  if (isBlank(body.contact_person))
    errors.contact_person = "Contact person is required.";
  if (isBlank(body.job_title))
    errors.job_title = "Job title or role is required.";
  if (isBlank(body.email) || !EMAIL_RE.test(body.email.trim()))
    errors.email = "A valid email address is required.";
  if (isBlank(body.phone))
    errors.phone = "Phone or WhatsApp number is required.";
  if (isBlank(body.location))
    errors.location = "City, state and country are required.";

  const students = Number.parseInt(body.student_count, 10);
  if (!Number.isFinite(students) || students < 1)
    errors.student_count = "Tell us roughly how many students you have.";

  if (isBlank(body.package) || !PACKAGE_IDS.includes(body.package))
    errors.package = "Choose the package you are interested in.";

  const licenses = Number.parseInt(body.student_licenses, 10);
  if (!Number.isFinite(licenses) || licenses < 1)
    errors.student_licenses = "Enter the number of student licenses you need.";

  if (isBlank(body.implementation_date))
    errors.implementation_date = "Choose a desired implementation date.";

  if (body.school_type && !SCHOOL_TYPE_IDS.includes(body.school_type))
    errors.school_type = "Choose a valid school type.";

  if (body.academic_year && !ACADEMIC_YEAR_IDS.includes(body.academic_year))
    errors.academic_year = "Choose a valid academic year.";

  if (
    asArray(body.subscription_durations).some((d) => !DURATION_IDS.includes(d))
  )
    errors.subscription_durations =
      "One or more selected durations are invalid.";

  if (!body.agreed_preorder)
    errors.agreed_preorder =
      "Please confirm you understand this is a pre-order request.";

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Reduce a raw payload to the exact row we insert. Trims strings, coerces
 * numbers, and drops anything not on the option lists.
 */
export function normaliseK12Preorder(body = {}) {
  const clampArr = (v, ids) => asArray(v).filter((x) => ids.includes(x));
  const intOrNull = (v) => {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  };

  return {
    school_org_name: body.school_org_name.trim(),
    contact_person: body.contact_person.trim(),
    job_title: body.job_title.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    location: body.location.trim(),

    school_type: SCHOOL_TYPE_IDS.includes(body.school_type)
      ? body.school_type
      : null,
    student_count: intOrNull(body.student_count),
    teacher_count: intOrNull(body.teacher_count),
    current_lms: body.current_lms?.trim() || null,

    package: PACKAGE_IDS.includes(body.package) ? body.package : null,
    student_licenses: intOrNull(body.student_licenses),
    subscription_durations: clampArr(body.subscription_durations, DURATION_IDS),

    implementation_date: body.implementation_date,
    academic_year: ACADEMIC_YEAR_IDS.includes(body.academic_year)
      ? body.academic_year
      : null,
    demo_requested:
      body.demo_requested === true || body.demo_requested === "yes",

    additional_requirements: body.additional_requirements?.trim() || null,
    agreed_preorder: Boolean(body.agreed_preorder),
  };
}

export const labelFor = (list, id) =>
  list.find((x) => x.id === id)?.label || id;

export const getPackage = (id) =>
  PREORDER_PACKAGES.find((p) => p.id === id) || null;
