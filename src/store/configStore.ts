// lib/config/client-config-store.ts
import defaultConfig from "@/config/config";
import { useConfig } from "@/lib/hooks/queries/config/useConfig";
import { ConfigType } from "@/types/config";
import { create } from "zustand";

interface ConfigStore {
  config: ConfigType | null;
  initialized: boolean;
  initialize: (config: ConfigType) => void;
  refreshConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: defaultConfig,
  initialized: false,
  initialize: (config) => set({ config, initialized: true }),
  refreshConfig: async () => {
    const { config } = useConfig();
    set({ config });
  },
}));
