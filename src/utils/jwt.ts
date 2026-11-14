type JwtPayload = { exp?: number };

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
}

// Lê o campo "exp" do JWT (sem validar a assinatura, que é papel da API).
export function isTokenExpired(token: string): boolean {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return false;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}
