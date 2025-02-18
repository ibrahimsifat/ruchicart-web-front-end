// Branch status enum
export enum BranchStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

// Branch promotion status enum
export enum BranchPromotionStatus {
  DISABLED = 0,
  ENABLED = 1,
}

// Base branch type
export interface BaseBranch {
  id: number;
  name: string;
  email: string;
  latitude: string;
  longitude: string;
  address: string;
  status: BranchStatus;
  branch_promotion_status: BranchPromotionStatus;
  created_at: string;
  updated_at: string;
  coverage: number;
  remember_token: string | null;
  image: string;
  phone: string;
  cover_image: string;
  distance?: number;
  preparation_time: number;
}
