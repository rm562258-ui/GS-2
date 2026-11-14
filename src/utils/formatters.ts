const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(isoDate: string): string {
  const elapsed = Date.now() - new Date(isoDate).getTime();

  if (Number.isNaN(elapsed)) {
    return '';
  }
  if (elapsed < MINUTE) {
    return 'agora';
  }
  if (elapsed < HOUR) {
    return `há ${Math.floor(elapsed / MINUTE)} min`;
  }
  if (elapsed < DAY) {
    return `há ${Math.floor(elapsed / HOUR)} h`;
  }

  const days = Math.floor(elapsed / DAY);
  return days === 1 ? 'há 1 dia' : `há ${days} dias`;
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

export function formatLiters(value: number): string {
  return `${formatNumber(value)} L`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

// Remove acentos e caixa para comparar textos na busca ("São José" encontra "sao jose").
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
