import * as Location from 'expo-location';

import type { Coordinates } from '@/utils/distance';

export type LocationPermission = 'granted' | 'denied' | 'undetermined';

const LAST_KNOWN_MAX_AGE_MS = 5 * 60 * 1000;

export const locationService = {
  async getPermission(): Promise<LocationPermission> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status;
  },

  async requestPermission(): Promise<LocationPermission> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status;
  },

  // Usa a última posição recente (resposta imediata) e, se não houver, consulta o GPS.
  // A alta precisão usa o GPS do aparelho e funciona mesmo sem internet.
  async getCurrentCoordinates(): Promise<Coordinates> {
    const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS });
    const position =
      lastKnown ??
      (await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        // Não pede para ligar a "precisão aprimorada" do Google: o GPS já basta.
        mayShowUserSettingsDialog: false,
      }));

    return {
      latitude: Number(position.coords.latitude.toFixed(6)),
      longitude: Number(position.coords.longitude.toFixed(6)),
    };
  },
};
