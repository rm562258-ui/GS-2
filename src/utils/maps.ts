import { Linking } from 'react-native';

// Abre o app de mapas do celular (sem chave de API). Recebe coordenadas ou um endereço.
export async function openInMaps(query: {
  latitude?: number;
  longitude?: number;
  address?: string;
}) {
  const target =
    query.latitude !== undefined && query.longitude !== undefined
      ? `${query.latitude},${query.longitude}`
      : (query.address ?? '');

  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`;
  await Linking.openURL(url);
}
