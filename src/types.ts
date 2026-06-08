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

export type SearchFilters = {
  query: string;
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
