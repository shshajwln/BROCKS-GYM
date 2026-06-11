export type MachineStatus = "live" | "coming_soon" | "offline";
export type EnquiryStatus = "new" | "contacted" | "closed";

export interface Machine {
  id: string;
  name: string;
  venue_name: string;
  venue_type: string;
  address: string;
  suburb: string;
  lat: number;
  lng: number;
  status: MachineStatus;
  notes: string | null;
  created_at: string;
}

export interface Enquiry {
  id: string;
  venue_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  venue_type: string;
  suburb: string | null;
  message: string | null;
  status: EnquiryStatus;
  created_at: string;
}

export const VENUE_TYPES = [
  { value: "bouldering_gym", label: "Bouldering / climbing gym" },
  { value: "hobby_shop", label: "Hobby or card shop" },
  { value: "arcade", label: "Arcade / entertainment venue" },
  { value: "cafe", label: "Cafe" },
  { value: "other", label: "Other" },
] as const;

export function venueTypeLabel(value: string): string {
  return VENUE_TYPES.find((v) => v.value === value)?.label ?? value;
}
