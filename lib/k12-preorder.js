// Blue Sands K12 platform pre-order: shared option lists and the pure
// validator used by both the API route and its unit tests. Keep the option
// ids stable. They are written to the k12_platform_preorders table verbatim.

export const SCHOOL_TYPES = [
  { id: "nursery_primary", label: "Nursery / Primary" },
  { id: "secondary",       label: "Secondary" },
  { id: "k12",             label: "K-12" },
  { id: "international",    label: "International School" },
  { id: "other",           label: "Other" },
];

// The eight things a school can license. Used both as the single-select
// "package interested in" and the multi-select "what are you interested in".
export const PLATFORM_INTERESTS = [
  { id: "stem_courses",         label: "STEM Courses" },
  { id: "phet_simulations",     label: "Interactive Simulations / PhET" },
  { id: "quizzes_assessments",  label: "Quizzes & Assessments" },
  { id: "teacher_tools",        label: "Teacher Tools" },
  { id: "student_dashboard",    label: "Student Learning Dashboard" },
  { id: "admin_dashboard",      label: "School Administration Dashboard" },
  { id: "reports_analytics",    label: "Reports & Analytics" },
  { id: "full_platform",        label: "Full Blue Sands K12 Platform" },
];

export const SUBSCRIPTION_DURATIONS = [
  { id: "termly",     label: "Termly" },
  { id: "annual",     label: "Annual" },
  { id: "multi_year", label: "Multi-year" },
];

export const ACADEMIC_YEAR_OPTIONS = [
  { id: "current", label: "Current academic year" },
  { id: "next",    label: "Next academic year" },
];

const SCHOOL_TYPE_IDS   = SCHOOL_TYPES.map((t) => t.id);
const INTEREST_IDS      = PLATFORM_INTERESTS.map((t) => t.id);
const DURATION_IDS      = SUBSCRIPTION_DURATIONS.map((t) => t.id);
const ACADEMIC_YEAR_IDS = ACADEMIC_YEAR_OPTIONS.map((t) => t.id);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isBlank  = (v) => !v || !String(v).trim();
const asArray  = (v) => (Array.isArray(v) ? v : []);

/**
 * Validate a K12 platform pre-order payload.
 * Returns { valid, errors } where errors is keyed by field name. A valid
 * payload has an empty errors object.
 */
export function validateK12Preorder(body = {}) {
  const errors = {};

  if (isBlank(body.school_org_name)) errors.school_org_name = "School or organisation name is required.";
  if (isBlank(body.contact_person))  errors.contact_person  = "Contact person is required.";
  if (isBlank(body.job_title))       errors.job_title       = "Job title or role is required.";
  if (isBlank(body.email) || !EMAIL_RE.test(body.email.trim()))
    errors.email = "A valid email address is required.";
  if (isBlank(body.phone))    errors.phone    = "Phone or WhatsApp number is required.";
  if (isBlank(body.location)) errors.location = "City, state and country are required.";

  const students = Number.parseInt(body.student_count, 10);
  if (!Number.isFinite(students) || students < 1)
    errors.student_count = "Tell us roughly how many students you have.";

  if (isBlank(body.package) || !INTEREST_IDS.includes(body.package))
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

  if (asArray(body.interests).some((i) => !INTEREST_IDS.includes(i)))
    errors.interests = "One or more selected interests are invalid.";

  if (asArray(body.subscription_durations).some((d) => !DURATION_IDS.includes(d)))
    errors.subscription_durations = "One or more selected durations are invalid.";

  if (!body.agreed_preorder)
    errors.agreed_preorder = "Please confirm you understand this is a pre-order request.";

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
    school_org_name:  body.school_org_name.trim(),
    contact_person:   body.contact_person.trim(),
    job_title:        body.job_title.trim(),
    email:            body.email.trim().toLowerCase(),
    phone:            body.phone.trim(),
    location:         body.location.trim(),

    school_type:      SCHOOL_TYPE_IDS.includes(body.school_type) ? body.school_type : null,
    student_count:    intOrNull(body.student_count),
    teacher_count:    intOrNull(body.teacher_count),
    current_lms:      body.current_lms?.trim() || null,

    package:                INTEREST_IDS.includes(body.package) ? body.package : null,
    student_licenses:       intOrNull(body.student_licenses),
    teacher_admin_accounts: intOrNull(body.teacher_admin_accounts),
    subscription_durations: clampArr(body.subscription_durations, DURATION_IDS),

    interests:        clampArr(body.interests, INTEREST_IDS),

    implementation_date: body.implementation_date,
    academic_year:       ACADEMIC_YEAR_IDS.includes(body.academic_year) ? body.academic_year : null,
    demo_requested:      body.demo_requested === true || body.demo_requested === "yes",

    additional_requirements: body.additional_requirements?.trim() || null,
    agreed_preorder:         Boolean(body.agreed_preorder),
  };
}

export const labelFor = (list, id) => list.find((x) => x.id === id)?.label || id;
