// Ponto único de acesso à API usado pelos serviços.
// PROVISÓRIO: aponta para a API simulada; na integração passa a usar o cliente HTTP (Axios).
import { placeholderApi } from './placeholder/placeholderApi';

export const apiClient = placeholderApi;
