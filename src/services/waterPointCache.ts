import AsyncStorage from '@react-native-async-storage/async-storage';

import type { WaterPoint } from '@/types/models';

// Última lista de pontos de água recebida da API, para consulta sem internet.
const CACHE_KEY = 'nexusverde.waterPoints';

type CachedWaterPoints = {
  savedAt: string;
  points: WaterPoint[];
};

export const waterPointCache = {
  async save(points: WaterPoint[]): Promise<void> {
    const cached: CachedWaterPoints = { savedAt: new Date().toISOString(), points };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  },

  async load(): Promise<CachedWaterPoints | null> {
    try {
      const stored = await AsyncStorage.getItem(CACHE_KEY);
      return stored ? (JSON.parse(stored) as CachedWaterPoints) : null;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEY);
  },
};
