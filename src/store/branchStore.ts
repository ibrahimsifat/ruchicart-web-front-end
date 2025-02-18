import { BaseBranch } from "@/types/branch";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const branchData: BaseBranch = {
  address: "lorem ipsum dollar",
  branch_promotion_status: 1,
  cover_image: "2023-09-06-64f83ba9c1a17.png",
  coverage: 20,
  created_at: "2021-02-24T03:45:49.000000Z",
  email: "newb@gmail.com",
  id: 1,
  image: "2025-01-22-67910c36d1141.png",
  latitude: "21.57436142068096",
  longitude: "39.16435967855793",
  name: "Eidgoan Branch",
  password: "$2y$10$xNJZTpZLADt4kQbSXMp7fui.9Pf55nJ604iY.QRCzHauae9VMzpeS",
  phone: "+8801100000000",
  preparation_time: 30,
  remember_token: null,
  status: 1,
  updated_at: "2025-01-22T15:18:14.000000Z",
};

interface BranchState {
  currentBranch: BaseBranch | null;
  setCurrentBranch: (branch: BaseBranch) => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      currentBranch: branchData,
      setCurrentBranch: (branch) => set({ currentBranch: branch }),
    }),
    {
      name: "branch-storage",
    }
  )
);
