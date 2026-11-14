import { isAxiosError } from 'axios';

import { AppError, DEFAULT_ERROR_MESSAGE } from '@/utils/appError';

// Formatos de erro mais comuns nas APIs Java (Spring) e .NET (ProblemDetails).
type ErrorBody = {
  message?: string;
  mensagem?: string;
  error?: string;
  erro?: string;
  title?: string;
  detail?: string;
  errors?: unknown;
  erros?: unknown;
};

const statusMessages: Record<number, string> = {
  400: 'Confira os dados informados.',
  401: 'Sua sessão expirou. Entre novamente.',
  403: 'Você não tem permissão para esta ação.',
  404: 'Registro não encontrado.',
  409: 'Esta operação entra em conflito com dados já cadastrados.',
  422: 'Confira os dados informados.',
  429: 'Muitas requisições em pouco tempo. Aguarde alguns segundos e tente novamente.',
};

// Lista de erros de validação: [{ campo|field, mensagem|message }] ou { campo: [mensagens] }.
function extractFieldErrors(errors: unknown): Record<string, string> | undefined {
  if (Array.isArray(errors)) {
    const entries = errors
      .map((item) => {
        const error = item as Record<string, unknown>;
        const field = error.campo ?? error.field ?? error.propertyName;
        const message = error.mensagem ?? error.message ?? error.defaultMessage;
        return typeof field === 'string' && typeof message === 'string'
          ? ([field, message] as const)
          : null;
      })
      .filter((entry): entry is readonly [string, string] => entry !== null);
    return entries.length ? Object.fromEntries(entries) : undefined;
  }

  if (errors && typeof errors === 'object') {
    const entries = Object.entries(errors as Record<string, unknown>)
      .map(([field, value]) => {
        const message = Array.isArray(value) ? value[0] : value;
        return typeof message === 'string' ? ([field, message] as const) : null;
      })
      .filter((entry): entry is readonly [string, string] => entry !== null);
    return entries.length ? Object.fromEntries(entries) : undefined;
  }

  return undefined;
}

function extractMessage(body: ErrorBody | string | undefined): string | undefined {
  if (typeof body === 'string') {
    return body.trim() && body.length < 200 ? body.trim() : undefined;
  }
  return body?.mensagem ?? body?.message ?? body?.detail ?? body?.erro ?? body?.title;
}

// Converte qualquer falha de requisição em AppError com mensagem em português.
export function toApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (!isAxiosError(error)) {
    return new AppError(DEFAULT_ERROR_MESSAGE);
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new AppError('O servidor demorou para responder. Tente novamente em instantes.');
  }

  if (!error.response) {
    return new AppError('Não foi possível conectar ao servidor. Verifique sua internet.');
  }

  const { status } = error.response;
  const body = error.response.data as ErrorBody | string | undefined;

  if (status >= 500) {
    return new AppError('O servidor está indisponível no momento. Tente novamente.', status);
  }

  const fieldErrors =
    typeof body === 'object' ? extractFieldErrors(body?.errors ?? body?.erros) : undefined;
  const firstFieldError = fieldErrors ? Object.values(fieldErrors)[0] : undefined;

  // A mensagem geral da API tem prioridade; mensagens genéricas de framework
  // (ex.: "Bad Request") dão lugar ao primeiro erro de campo ou ao texto padrão do status.
  const apiMessage = extractMessage(body);
  const usefulApiMessage = apiMessage && !isGenericFrameworkMessage(apiMessage) ? apiMessage : null;
  const message =
    usefulApiMessage ?? firstFieldError ?? statusMessages[status] ?? DEFAULT_ERROR_MESSAGE;

  return new AppError(message, status, fieldErrors);
}

function isGenericFrameworkMessage(message: string): boolean {
  return /^(bad request|unauthorized|forbidden|not found|conflict|unprocessable entity)$/i.test(
    message.trim(),
  );
}
