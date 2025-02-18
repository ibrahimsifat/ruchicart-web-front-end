import { ConfigType } from "@/types/config";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ConfigState {
  config: ConfigType | null;
  setConfig: (config: ConfigType) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: null,
      setConfig: (config) => set({ config }),
    }),
    {
      name: "config-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
