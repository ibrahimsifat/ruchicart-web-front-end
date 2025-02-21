import * as z from "zod";

export interface Address {
  id: number;
  address_type: string;
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
export const addressZodSchema = z.object({
  address_type: z.enum(["home", "work", "other"]),
  address: z.string().min(1, "Address is required"),
  road: z.string().min(1, "Road is required"),
  floor: z.string().min(1, "Floor is required"),
  house: z.string().min(1, "House is required"),
  contact_person_name: z.string().min(1, "Contact person name is required"),
  contact_person_number: z.string().min(1, "Phone number is required"),
  is_default: z.boolean().optional(),
});
