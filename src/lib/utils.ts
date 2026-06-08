import Papa from "papaparse";
import type { Hospital, SearchFilters } from "../types";

export const defaultFilters: SearchFilters = {
  query: "",
  location: "",
  state: "",
  specialty: "",
  ownership: "",
  emergencyOnly: false,
};

export function filterHospitals(
  items: Hospital[],
  filters: SearchFilters,
): Hospital[] {
  const query = filters.query.trim().toLowerCase();
  const locationQuery = filters.location.trim().toLowerCase();

  return items.filter((hospital) => {
    const searchable = [
      hospital.name,
      hospital.city,
      hospital.state,
      hospital.lga,
      hospital.address,
      ...hospital.specialties,
    ]
      .join(" ")
      .toLowerCase();

    const locationMatch =
      !locationQuery ||
      [hospital.city, hospital.lga, hospital.address]
        .join(" ")
        .toLowerCase()
        .includes(locationQuery);

    return (
      (!query || searchable.includes(query)) &&
      locationMatch &&
      (!filters.state || hospital.state === filters.state) &&
      (!filters.specialty ||
        hospital.specialties.includes(filters.specialty)) &&
      (!filters.ownership || hospital.ownership === filters.ownership) &&
      (!filters.emergencyOnly || hospital.emergency24h)
    );
  });
}

export function filtersToSearchParams(filters: SearchFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });
  return params;
}

export function filtersFromSearchParams(params: URLSearchParams): SearchFilters {
  return {
    query: params.get("query") ?? "",
    location: params.get("location") ?? "",
    state: params.get("state") ?? "",
    specialty: params.get("specialty") ?? "",
    ownership: params.get("ownership") ?? "",
    emergencyOnly: params.get("emergencyOnly") === "true",
  };
}

export type ExportColumn =
  | "name"
  | "address"
  | "phone"
  | "email"
  | "specialties"
  | "rating";

export function hospitalsToCsv(
  items: Hospital[],
  columns: ExportColumn[],
): string {
  const rows = items.map((hospital) =>
    Object.fromEntries(
      columns.map((column) => [
        column,
        column === "specialties"
          ? hospital.specialties.join("; ")
          : hospital[column],
      ]),
    ),
  );
  return Papa.unparse(rows, { columns });
}

export function exportHospitals(
  items: Hospital[],
  columns: ExportColumn[],
  query: string,
) {
  const csv = hospitalsToCsv(items, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  const slug = query.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "all";
  anchor.href = url;
  anchor.download = `hospitals-${slug}-${date}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function distanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
) {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLongitude / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
