// Guards the Blue Sands K12 platform pre-order payload contract: the option
// lists the form and admin share, and the pure validator the API route runs.
import { describe, it, expect } from "vitest";
import {
  SCHOOL_TYPES,
  PREORDER_PACKAGES,
  SUBSCRIPTION_DURATIONS,
  ACADEMIC_YEAR_OPTIONS,
  TABLET_OPTIONS,
  validateK12Preorder,
  normaliseK12Preorder,
  labelFor,
  getPackage,
  packagePrice,
  summarisePreorders,
} from "@/lib/k12-preorder";

const TABLET = "virtual-science-lab-tablet";

const validBody = () => ({
  school_org_name: "Bright Stars Academy",
  contact_person: "Adesola Martins",
  job_title: "Head Teacher",
  email: "ADESOLA@brightstars.NG",
  phone: "+234 801 234 5678",
  location: "Lekki, Lagos, Nigeria",
  school_type: "k12",
  student_count: "420",
  teacher_count: "30",
  current_lms: "Google Classroom",
  package: "ar-science-lab-full-kit",
  student_licenses: "420",
  subscription_durations: ["annual", "multi_year"],
  implementation_date: "2026-01-12",
  academic_year: "next",
  demo_requested: "yes",
  additional_requirements: "  We use the Nigerian curriculum.  ",
  agreed_preorder: true,
});

describe("option lists", () => {
  it("every list option has a non-empty id and label", () => {
    for (const list of [SCHOOL_TYPES, SUBSCRIPTION_DURATIONS, ACADEMIC_YEAR_OPTIONS, TABLET_OPTIONS]) {
      for (const opt of list) {
        expect(opt.id).toMatch(/^[a-z0-9_]+$/);
        expect(opt.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("has exactly four pre-order packages, each fully described", () => {
    expect(PREORDER_PACKAGES).toHaveLength(4);
    for (const p of PREORDER_PACKAGES) {
      expect(p.id).toMatch(/^[a-z0-9-]+$/);
      expect(p.label.trim().length).toBeGreaterThan(0);
      expect(p.image).toMatch(/\.(png|jpe?g|webp)$/);
      expect(p.imageW).toBeGreaterThan(0);
      expect(p.imageH).toBeGreaterThan(0);
      expect(p.ageRange.trim().length).toBeGreaterThan(0);
      expect(p.books.trim().length).toBeGreaterThan(0);
      expect(p.topics.length).toBeGreaterThan(0);
      expect(p.includes.length).toBeGreaterThan(0);
      expect(p.priceUSD).toBeGreaterThan(0);
      expect(p.priceNGN).toBeGreaterThan(0);
    }
  });

  it("only the tablet package has the with/without choice", () => {
    const withOption = PREORDER_PACKAGES.filter((p) => p.hasTabletOption);
    expect(withOption.map((p) => p.id)).toEqual([TABLET]);
  });

  it("tablet options carry a price, unit and description", () => {
    expect(TABLET_OPTIONS.map((o) => o.id)).toEqual(["with", "without"]);
    for (const o of TABLET_OPTIONS) {
      expect(o.priceNGN).toBeGreaterThan(0);
      expect(o.priceUSD).toBeGreaterThan(0);
      expect(o.unit.trim().length).toBeGreaterThan(0);
      expect(o.description.length).toBeGreaterThan(20);
    }
    const [withT, withoutT] = TABLET_OPTIONS;
    expect(withT.priceNGN).toBe(160_000);
    expect(withoutT.priceNGN).toBe(50_000);
  });

  it("package ids are unique", () => {
    const ids = PREORDER_PACKAGES.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labelFor and getPackage resolve a known id and fall back cleanly", () => {
    expect(labelFor(PREORDER_PACKAGES, "ar-science-lab-full-kit")).toBe("AR Science Lab");
    expect(labelFor(PREORDER_PACKAGES, "nope")).toBe("nope");
    expect(getPackage("into-the-community").ageRange).toBe("Ages 4 to 7");
    expect(getPackage("nope")).toBeNull();
  });
});

describe("validateK12Preorder", () => {
  it("accepts a complete payload", () => {
    expect(validateK12Preorder(validBody())).toEqual({ valid: true, errors: {} });
  });

  it("flags every missing required field", () => {
    const { valid, errors } = validateK12Preorder({});
    expect(valid).toBe(false);
    for (const field of [
      "school_org_name", "contact_person", "job_title", "email",
      "phone", "location", "student_count", "package",
      "student_licenses", "implementation_date", "agreed_preorder",
    ]) {
      expect(errors).toHaveProperty(field);
    }
  });

  it("rejects a malformed email", () => {
    expect(validateK12Preorder({ ...validBody(), email: "adesola@" }).errors).toHaveProperty("email");
  });

  it("rejects a non-positive student count or licence count", () => {
    expect(validateK12Preorder({ ...validBody(), student_count: "0" }).errors).toHaveProperty("student_count");
    expect(validateK12Preorder({ ...validBody(), student_licenses: "-5" }).errors).toHaveProperty("student_licenses");
  });

  it("rejects an unknown package, school type, or duration", () => {
    expect(validateK12Preorder({ ...validBody(), package: "stem_courses" }).errors).toHaveProperty("package");
    expect(validateK12Preorder({ ...validBody(), school_type: "college" }).errors).toHaveProperty("school_type");
    expect(validateK12Preorder({ ...validBody(), subscription_durations: ["weekly"] }).errors).toHaveProperty("subscription_durations");
  });

  it("rejects an unknown tablet_option but allows with / without / absent", () => {
    expect(validateK12Preorder({ ...validBody(), tablet_option: "maybe" }).errors).toHaveProperty("tablet_option");
    expect(validateK12Preorder({ ...validBody(), package: TABLET, tablet_option: "without" }).valid).toBe(true);
    expect(validateK12Preorder({ ...validBody(), package: TABLET }).valid).toBe(true);
  });

  it("requires the pre-order confirmation checkbox", () => {
    expect(validateK12Preorder({ ...validBody(), agreed_preorder: false }).errors).toHaveProperty("agreed_preorder");
  });

  it("treats optional fields as optional", () => {
    const body = validBody();
    delete body.teacher_count;
    delete body.current_lms;
    delete body.subscription_durations;
    delete body.academic_year;
    delete body.demo_requested;
    delete body.additional_requirements;
    expect(validateK12Preorder(body).valid).toBe(true);
  });
});

describe("packagePrice", () => {
  it("returns the per-kit price for a book package regardless of tablet_option", () => {
    const p = getPackage("into-the-community");
    expect(packagePrice(p, "without")).toEqual({ usd: 250, ngn: 345_000, unit: "per kit" });
  });

  it("prices the tablet by its chosen option, defaulting to 'with'", () => {
    const t = getPackage(TABLET);
    const [withT, withoutT] = TABLET_OPTIONS;
    expect(packagePrice(t, "with")).toEqual({ usd: withT.priceUSD, ngn: withT.priceNGN, unit: withT.unit });
    expect(packagePrice(t, "without")).toEqual({ usd: withoutT.priceUSD, ngn: withoutT.priceNGN, unit: withoutT.unit });
    expect(packagePrice(t, undefined)).toEqual(packagePrice(t, "with"));
  });

  it("is safe for a missing package", () => {
    expect(packagePrice(null)).toEqual({ usd: 0, ngn: 0, unit: null });
  });
});

describe("summarisePreorders", () => {
  it("counts rows and sums one package price per pre-order", () => {
    const s = summarisePreorders([
      { package: "into-the-community", status: "new" },       // $250
      { package: "into-the-community", status: "contacted" }, // $250
      { package: "ar-science-lab-full-kit", status: "qualified" }, // $450
    ]);
    expect(s.total).toBe(3);
    expect(s.awaiting).toBe(1);
    expect(s.qualified).toBe(1);
    expect(s.valued).toBe(3);
    expect(s.valueUSD).toBe(950);
    expect(s.valueNGN).toBe(345_000 + 345_000 + 620_000);
  });

  it("excludes declined rows from the value but still counts them in total", () => {
    const s = summarisePreorders([
      { package: "into-the-community", status: "declined" },
      { package: "into-the-community", status: "new" },
    ]);
    expect(s.total).toBe(2);
    expect(s.valued).toBe(1);
    expect(s.valueUSD).toBe(250);
  });

  it("ignores rows with an unknown or missing package", () => {
    const s = summarisePreorders([
      { package: null, status: "new" },
      { package: "gone", status: "contacted" },
    ]);
    expect(s.total).toBe(2);
    expect(s.valued).toBe(0);
    expect(s.valueUSD).toBe(0);
  });

  it("uses the without-tablet price when the row says so", () => {
    const [withT, withoutT] = TABLET_OPTIONS;
    const s = summarisePreorders([
      { package: TABLET, status: "new", tablet_option: "with" },
      { package: TABLET, status: "new", tablet_option: "without" },
    ]);
    expect(s.valueUSD).toBe(withT.priceUSD + withoutT.priceUSD);
    expect(s.valueNGN).toBe(withT.priceNGN + withoutT.priceNGN);
  });

  it("handles an empty list", () => {
    expect(summarisePreorders()).toEqual({
      total: 0, awaiting: 0, qualified: 0, valued: 0, valueUSD: 0, valueNGN: 0,
    });
  });
});

describe("normaliseK12Preorder", () => {
  it("trims, lowercases the email, and coerces numbers", () => {
    const row = normaliseK12Preorder(validBody());
    expect(row.email).toBe("adesola@brightstars.ng");
    expect(row.student_count).toBe(420);
    expect(row.teacher_count).toBe(30);
    expect(row.package).toBe("ar-science-lab-full-kit");
    expect(row.additional_requirements).toBe("We use the Nigerian curriculum.");
    expect(row.demo_requested).toBe(true);
  });

  it("does not carry retired fields onto the row", () => {
    const row = normaliseK12Preorder({ ...validBody(), interests: ["x"], teacher_admin_accounts: "9" });
    expect(row).not.toHaveProperty("interests");
    expect(row).not.toHaveProperty("teacher_admin_accounts");
  });

  it("drops values not on the option lists", () => {
    const row = normaliseK12Preorder({
      ...validBody(),
      package: "bogus",
      subscription_durations: ["annual", "bogus"],
      school_type: "bogus",
      academic_year: "bogus",
    });
    expect(row.package).toBeNull();
    expect(row.subscription_durations).toEqual(["annual"]);
    expect(row.school_type).toBeNull();
    expect(row.academic_year).toBeNull();
  });

  it("nulls blank optional numbers and text", () => {
    const row = normaliseK12Preorder({ ...validBody(), teacher_count: "", current_lms: "   " });
    expect(row.teacher_count).toBeNull();
    expect(row.current_lms).toBeNull();
  });

  it("only sets tablet_option for the tablet package", () => {
    expect(normaliseK12Preorder({ ...validBody(), tablet_option: "without" }).tablet_option).toBeNull();
    expect(normaliseK12Preorder({ ...validBody(), package: TABLET, tablet_option: "without" }).tablet_option).toBe("without");
    expect(normaliseK12Preorder({ ...validBody(), package: TABLET }).tablet_option).toBe("with");
  });
});
