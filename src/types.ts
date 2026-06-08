export type Ownership = "Public" | "Private" | "Mission";

export type Hospital = {
  id: string;
  name: string;
  type: string;
  ownership: Ownership;
  address: string;
  city: string;
  state: string;
  lga: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  specialties: string[];
  services: string[];
  amenities: string[];
  equipment: string[];
  hours: string;
  emergency24h: boolean;
  ambulance: boolean;
  verified: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  priceLevel: "₦" | "₦₦" | "₦₦₦";
};

export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  latitude: number;
  longitude: number;
  open24h: boolean;
  services: string[];
  verified: boolean;
};

export type SearchFilters = {
  query: string;
  location: string;
  state: string;
  specialty: string;
  ownership: string;
  emergencyOnly: boolean;
};

export type Review = {
  id: string;
  hospitalId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type AppointmentRequest = {
  id: string;
  hospitalId: string;
  date: string;
  note: string;
  status: "pending" | "submitted";
};
