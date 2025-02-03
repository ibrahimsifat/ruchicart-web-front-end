export interface Address {
  id: number | string;
  address_type: "home" | "work" | "other";
  label?: string;
  address: string;
  house?: string;
  road?: string;
  is_guest: number;
  floor?: string;
  contact_person_name: string;
  contact_person_number: string;
  longitude?: number;
  latitude?: number;
  is_default?: number;
}
