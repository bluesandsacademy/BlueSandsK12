// Guards the Blue Sands K12 platform pre-order payload contract: the option
// lists the form and admin share, and the pure validator the API route runs.
import { describe, it, expect } from "vitest";
import {
  SCHOOL_TYPES,
  PLATFORM_INTERESTS,
  SUBSCRIPTION_DURATIONS,
  ACADEMIC_YEAR_OPTIONS,
  validateK12Preorder,
  normaliseK12Preorder,
  labelFor,
} from "@/lib/k12-preorder";

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
  package: "full_platform",
  student_licenses: "420",
  teacher_admin_accounts: "35",
  subscription_durations: ["annual", "multi_year"],
  interests: ["stem_courses", "phet_simulations"],
  implementation_date: "2026-01-12",
  academic_year: "next",
  demo_requested: "yes",
  additional_requirements: "  We use the Nigerian curriculum.  ",
  agreed_preorder: true,
});

describe("option lists", () => {
  it("every option has a non-empty id and label", () => {
    for (const list of [SCHOOL_TYPES, PLATFORM_INTERESTS, SUBSCRIPTION_DURATIONS, ACADEMIC_YEAR_OPTIONS]) {
      for (const opt of list) {
        expect(opt.id).toMatch(/^[a-z0-9_]+$/);
        expect(opt.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("interest ids are unique", () => {
    const ids = PLATFORM_INTERESTS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labelFor resolves a known id and falls back to the id", () => {
    expect(labelFor(PLATFORM_INTERESTS, "teacher_tools")).toBe("Teacher Tools");
    expect(labelFor(PLATFORM_INTERESTS, "nope")).toBe("nope");
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

  it("rejects an unknown package, school type, interest, or duration", () => {
    expect(validateK12Preorder({ ...validBody(), package: "hardware" }).errors).toHaveProperty("package");
    expect(validateK12Preorder({ ...validBody(), school_type: "college" }).errors).toHaveProperty("school_type");
    expect(validateK12Preorder({ ...validBody(), interests: ["stem_courses", "x"] }).errors).toHaveProperty("interests");
    expect(validateK12Preorder({ ...validBody(), subscription_durations: ["weekly"] }).errors).toHaveProperty("subscription_durations");
  });

  it("requires the pre-order confirmation checkbox", () => {
    expect(validateK12Preorder({ ...validBody(), agreed_preorder: false }).errors).toHaveProperty("agreed_preorder");
  });

  it("treats optional fields as optional", () => {
    const body = validBody();
    delete body.teacher_count;
    delete body.current_lms;
    delete body.teacher_admin_accounts;
    delete body.subscription_durations;
    delete body.interests;
    delete body.academic_year;
    delete body.demo_requested;
    delete body.additional_requirements;
    expect(validateK12Preorder(body).valid).toBe(true);
  });
});

describe("normaliseK12Preorder", () => {
  it("trims, lowercases the email, and coerces numbers", () => {
    const row = normaliseK12Preorder(validBody());
    expect(row.email).toBe("adesola@brightstars.ng");
    expect(row.student_count).toBe(420);
    expect(row.teacher_count).toBe(30);
    expect(row.additional_requirements).toBe("We use the Nigerian curriculum.");
    expect(row.demo_requested).toBe(true);
  });

  it("drops values not on the option lists", () => {
    const row = normaliseK12Preorder({
      ...validBody(),
      interests: ["stem_courses", "bogus"],
      subscription_durations: ["annual", "bogus"],
      school_type: "bogus",
      academic_year: "bogus",
    });
    expect(row.interests).toEqual(["stem_courses"]);
    expect(row.subscription_durations).toEqual(["annual"]);
    expect(row.school_type).toBeNull();
    expect(row.academic_year).toBeNull();
  });

  it("nulls blank optional numbers and text", () => {
    const row = normaliseK12Preorder({ ...validBody(), teacher_count: "", current_lms: "   " });
    expect(row.teacher_count).toBeNull();
    expect(row.current_lms).toBeNull();
  });
});
