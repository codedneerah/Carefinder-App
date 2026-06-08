import { describe, expect, it } from "vitest";
import { hospitals } from "../data/hospitals";
import {
  distanceKm,
  filterHospitals,
  filtersFromSearchParams,
  filtersToSearchParams,
  hospitalsToCsv,
} from "./utils";

describe("hospital filtering", () => {
  it("searches names, cities, LGAs, and specialties", () => {
    const results = filterHospitals(hospitals, {
      query: "orthopaedics",
      location: "",
      state: "",
      specialty: "",
      ownership: "",
      emergencyOnly: false,
    });
    expect(results.map(({ name }) => name)).toContain("Cedarcrest Hospitals");
  });

  it("combines state, specialty, ownership, and emergency filters", () => {
    const results = filterHospitals(hospitals, {
      query: "",
      location: "",
      state: "Lagos",
      specialty: "Maternity",
      ownership: "Private",
      emergencyOnly: true,
    });
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Evercare Hospital Lekki");
  });
});

describe("CSV export", () => {
  it("only includes selected columns", () => {
    const csv = hospitalsToCsv(hospitals.slice(0, 1), ["name", "phone"]);
    expect(csv.split("\r\n")[0]).toBe("name,phone");
    expect(csv).not.toContain("specialties");
  });
});

describe("shareable filters", () => {
  it("round trips active filters through URL parameters", () => {
    const filters = {
      query: "Lagos",
      location: "",
      state: "Lagos",
      specialty: "Emergency",
      ownership: "",
      emergencyOnly: true,
    };
    expect(filtersFromSearchParams(filtersToSearchParams(filters))).toEqual(
      filters,
    );
  });
});

describe("distance calculation", () => {
  it("calculates a plausible Lagos to Abuja distance", () => {
    const distance = distanceKm(
      { latitude: 6.5244, longitude: 3.3792 },
      { latitude: 9.0765, longitude: 7.3986 },
    );
    expect(distance).toBeGreaterThan(500);
    expect(distance).toBeLessThan(600);
  });
});
