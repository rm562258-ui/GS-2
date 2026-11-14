import { useCallback, useEffect, useState } from 'react';

import { locationService, type LocationPermission } from '@/services/locationService';
import type { Coordinates } from '@/utils/distance';

type UseCurrentLocationOptions = {
  /** Busca a localização ao abrir a tela, se a permissão já tiver sido concedida. */
  loadOnMount?: boolean;
};

export function useCurrentLocation({ loadOnMount = false }: UseCurrentLocationOptions = {}) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [permission, setPermission] = useState<LocationPermission>('undetermined');
  const [isLoading, setIsLoading] = useState(false);

  // Pede a permissão (se preciso) e retorna a posição atual.
  const requestLocation = useCallback(async (): Promise<Coordinates | null> => {
    setIsLoading(true);
    try {
      const status = await locationService.requestPermission();
      setPermission(status);

      if (status !== 'granted') {
        return null;
      }

      const current = await locationService.getCurrentCoordinates();
      setCoordinates(current);
      return current;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loadOnMount) {
      return;
    }

    locationService.getPermission().then((status) => {
      setPermission(status);
      if (status === 'granted') {
        requestLocation();
      }
    });
  }, [loadOnMount, requestLocation]);

  return { coordinates, permission, isLoading, requestLocation };
}
