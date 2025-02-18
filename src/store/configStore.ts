import { useConfig } from "@/lib/hooks/queries/config/useConfig";
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
      // fetch config if not set
      setConfig: async (config) => {
        if (!config) {
          const { data } = await useConfig();
          set({ config: data });
        } else {
          set({ config });
        }
      },
    }),
    {
      name: "config-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
