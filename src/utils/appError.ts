// Erro padronizado usado pelos serviços, para as telas exibirem mensagens claras.
export class AppError extends Error {
  readonly status?: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(message: string, status?: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export const DEFAULT_ERROR_MESSAGE = 'Algo deu errado. Tente novamente em instantes.';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError || error instanceof Error) {
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof AppError && error.status === 401;
}

// Sem resposta do servidor (sem internet, tempo esgotado) ou servidor fora do ar.
export function isNetworkError(error: unknown): boolean {
  return error instanceof AppError && (error.status === undefined || error.status >= 500);
}
