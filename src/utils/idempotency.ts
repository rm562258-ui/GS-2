// Gera um identificador único (UUID v4) para o cabeçalho Idempotency-Key.
// Se a mesma criação for reenviada (ex.: toque duplo ou nova tentativa), a API pode
// reconhecer a chave e evitar registros duplicados.
export function createIdempotencyKey(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = (Math.random() * 16) | 0;
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
