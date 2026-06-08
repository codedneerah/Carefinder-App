import type { AppointmentRequest, Review } from "../types";

const FAVORITES_KEY = "carefinder-favorites";
const LISTS_KEY = "carefinder-personal-lists";
const REVIEWS_KEY = "carefinder-reviews";
const APPOINTMENTS_KEY = "carefinder-appointments";

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getFavoriteHospitalIds(): string[] {
  return safeParse(localStorage.getItem(FAVORITES_KEY), []);
}

export function isHospitalBookmarked(hospitalId: string) {
  return getFavoriteHospitalIds().includes(hospitalId);
}

export function toggleHospitalBookmark(hospitalId: string) {
  const current = getFavoriteHospitalIds();
  const next = current.includes(hospitalId)
    ? current.filter((id) => id !== hospitalId)
    : [...current, hospitalId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}

export function getPersonalLists(): Record<string, string[]> {
  return safeParse(localStorage.getItem(LISTS_KEY), {});
}

export function createPersonalList(name: string) {
  const lists = getPersonalLists();
  if (lists[name]) return lists;
  const next = { ...lists, [name]: [] };
  localStorage.setItem(LISTS_KEY, JSON.stringify(next));
  return next;
}

export function toggleHospitalInList(listName: string, hospitalId: string) {
  const lists = getPersonalLists();
  const list = new Set(lists[listName] ?? []);
  if (list.has(hospitalId)) list.delete(hospitalId);
  else list.add(hospitalId);
  const next = { ...lists, [listName]: [...list] };
  localStorage.setItem(LISTS_KEY, JSON.stringify(next));
  return next;
}

export function getReviewsForHospital(hospitalId: string): Review[] {
  return safeParse(localStorage.getItem(REVIEWS_KEY), []).filter(
    (review: Review) => review.hospitalId === hospitalId,
  );
}

export function submitReview(
  hospitalId: string,
  review: Omit<Review, "id" | "date" | "hospitalId">,
) {
  const stored = safeParse<Review[]>(localStorage.getItem(REVIEWS_KEY), []);
  const next: Review = {
    id: `review-${Date.now()}`,
    hospitalId,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    ...review,
  };
  const updated = [next, ...stored];
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  return next;
}

export function getAppointments(): AppointmentRequest[] {
  return safeParse(localStorage.getItem(APPOINTMENTS_KEY), []);
}

export function submitAppointment(request: Omit<AppointmentRequest, "id" | "status">) {
  const stored = getAppointments();
  const next: AppointmentRequest = {
    id: `appointment-${Date.now()}`,
    status: "pending",
    ...request,
  };
  const updated = [next, ...stored];
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
  return next;
}
