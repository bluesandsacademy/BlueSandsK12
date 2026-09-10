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
// details rendered under the selected card. `priceUSD` / `priceNGN` are the
// per-package list prices (from lib/products.js; the tablet's naira figure is
// indicative, it is normally quoted). The admin list uses them to estimate the
// value of the pre-order pipeline: one package price per pre-order.
export const PREORDER_PACKAGES = [
  {
    id: "into-the-community",
    label: "Into the Community",
    image: "/products/into-the-community.png",
    imageW: 605,
    imageH: 561,
    ageRange: "Ages 4 to 7",
    books: "5 interactive AR books",
    topics: [
      "People and places",
      "Everyday environments",
      "Read-along stories",
    ],
    includes: ["Smart Tablet", "Spotty Camera", "Marker Set", "AR Pedia app"],
    priceUSD: 250,
    priceNGN: 345_000,
  },
  {
    id: "into-the-curiosity-q",
    label: "Into the Curiosity Q",
    image: "/products/into-the-curiosity-q.png",
    imageW: 629,
    imageH: 605,
    ageRange: "Ages 5 to 9",
    books: "10 interactive AR books",
    topics: [
      "Universal knowledge",
      "Everyday questions in AR",
      "See, touch, interact",
    ],
    includes: ["Smart Tablet", "Spotty Camera", "Marker Set", "AR Pedia app"],
    priceUSD: 350,
    priceNGN: 480_000,
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
    priceUSD: 450,
    priceNGN: 620_000,
  },
  {
    id: "virtual-science-lab-tablet",
    label: "Virtual Science Lab Tablet",
    image: "/real-products/smart-tablet-1.png",
    imageW: 1024,
    imageH: 1024,
    ageRange: "Secondary School",
    books: "Digital textbook library across 9 subjects",
    topics: [
      "250+ science simulations",
      "Physics, Chemistry, Biology, Earth science",
      "AI study assistant",
      "Teacher dashboard and LMS",
    ],
    includes: ["Smart Tablet", "Virtual Science Labs", "STEM simulations"],
    priceUSD: 150,
    priceNGN: 240_000,
    // This one can be taken without the Smart Tablet, running on a device the
    // school already owns. That drops the per-student price by $50.
    hasTabletOption: true,
    priceWithoutUSD: 100,
    priceWithoutNGN: 160_000,
  },
];

// The Smart Tablet choice, shown only for the package with `hasTabletOption`.
export const TABLET_OPTIONS = [
  { id: "with", label: "With Smart Tablet" },
  { id: "without", label: "Without the tablet, we use our own device" },
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

  if (body.tablet_option && !["with", "without"].includes(body.tablet_option))
    errors.tablet_option = "Choose whether you want the Smart Tablet included.";

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
    // Only the tablet package carries a with/without choice; every other
    // package leaves this null.
    tablet_option: getPackage(body.package)?.hasTabletOption
      ? body.tablet_option === "without"
        ? "without"
        : "with"
      : null,
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

/**
 * List price for a package, in both currencies. For the tablet package a
 * `tabletOption` of "without" returns the lower, bring-your-own-device price.
 */
export function packagePrice(pkg, tabletOption) {
  if (!pkg) return { usd: 0, ngn: 0 };
  if (pkg.hasTabletOption && tabletOption === "without")
    return { usd: pkg.priceWithoutUSD, ngn: pkg.priceWithoutNGN };
  return { usd: pkg.priceUSD, ngn: pkg.priceNGN };
}

/**
 * Roll up a set of pre-order rows for the admin stat cards. Each row is worth
 * one package list price; declined rows are left out of the value total. Rows
 * need `package`, `status` and (for the tablet) `tablet_option`.
 */
export function summarisePreorders(rows = []) {
  const summary = {
    total: rows.length,
    awaiting: 0, // status "new"
    qualified: 0,
    valued: 0, // rows counted toward the value estimate
    valueUSD: 0,
    valueNGN: 0,
  };

  for (const row of rows) {
    if (row.status === "new") summary.awaiting += 1;
    if (row.status === "qualified") summary.qualified += 1;
    if (row.status === "declined") continue;

    const pkg = getPackage(row.package);
    if (!pkg) continue;
    const price = packagePrice(pkg, row.tablet_option);
    summary.valued += 1;
    summary.valueUSD += price.usd;
    summary.valueNGN += price.ngn;
  }

  return summary;
}
