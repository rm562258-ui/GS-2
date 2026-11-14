import { env } from '@/config/env';

// A API fica em um plano gratuito que "dorme" sem uso. Ao abrir o app, uma chamada leve
// à verificação de saúde começa a acordá-la enquanto o usuário ainda está na tela de login.
export function warmUpApi(): void {
  fetch(env.healthUrl).catch(() => undefined);
}
