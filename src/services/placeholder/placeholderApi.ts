// PROVISÓRIO: simula as rotas da API em memória, com o mesmo formato de resposta do Axios
// ({ data }). Será substituído pelo cliente HTTP real quando a API do backend estiver pronta.
import type {
  AuthResponseDto,
  LoginRequestDto,
  PontoAguaDto,
  PontoAguaRequestDto,
  RegiaoDto,
  RegisterRequestDto,
  SolicitacaoDto,
  SolicitacaoRequestDto,
  StatusRequestDto,
  UsuarioDto,
} from '@/types/api';
import type { Urgency } from '@/types/models';
import { AppError } from '@/utils/appError';

import { tokenStore } from '../tokenStore';
import {
  seedHelpRequests,
  seedRegions,
  seedUsers,
  seedWaterPoints,
  type PlaceholderUser,
} from './seed';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type PlaceholderResponse<T> = { data: T; status: number };

const TOKEN_PREFIX = 'placeholder-token.';

const database = {
  users: seedUsers.map((user) => ({ ...user })),
  helpRequests: seedHelpRequests.map((request) => ({ ...request })),
  waterPoints: seedWaterPoints.map((point) => ({ ...point })),
  regions: seedRegions.map((region) => ({ ...region })),
};

let idSequence = 100;
const nextId = (prefix: string) => `${prefix}${++idSequence}`;
const now = () => new Date().toISOString();

const simulateLatency = () =>
  new Promise((resolve) => setTimeout(resolve, 350 + Math.random() * 450));

const toPublicUser = ({ senha: _password, ...user }: PlaceholderUser): UsuarioDto => user;

const urgencyWeight: Record<Urgency, number> = { BAIXA: 15, MEDIA: 35, ALTA: 60, CRITICA: 80 };

// Regra simples de priorização usada só nos dados provisórios.
function calculatePriority(request: SolicitacaoRequestDto): number {
  const vulnerableBonus = request.grupoVulneravel ? 10 : 0;
  const peopleBonus = Math.min(10, Math.floor(request.quantidadePessoas / 3) * 2);
  return Math.min(100, urgencyWeight[request.urgencia] + vulnerableBonus + peopleBonus);
}

function requireUser(): PlaceholderUser {
  const token = tokenStore.get();
  const userId = token?.startsWith(TOKEN_PREFIX) ? token.slice(TOKEN_PREFIX.length) : null;
  const user = database.users.find((candidate) => candidate.id === userId);

  if (!user) {
    throw new AppError('Sua sessão expirou. Entre novamente.', 401);
  }

  return user;
}

function requireTeam(user: PlaceholderUser) {
  if (user.papel !== 'EQUIPE') {
    throw new AppError('Você não tem permissão para esta ação.', 403);
  }
}

function findHelpRequest(id: string) {
  const request = database.helpRequests.find((candidate) => String(candidate.id) === id);
  if (!request) {
    throw new AppError('Pedido de ajuda não encontrado.', 404);
  }
  return request;
}

function findWaterPoint(id: string) {
  const point = database.waterPoints.find((candidate) => String(candidate.id) === id);
  if (!point) {
    throw new AppError('Ponto de água não encontrado.', 404);
  }
  return point;
}

function assertOwnOpenRequest(user: PlaceholderUser, request: SolicitacaoDto) {
  if (request.solicitante?.id !== user.id) {
    throw new AppError('Você só pode alterar os seus próprios pedidos.', 403);
  }
  if (request.status !== 'ABERTA') {
    throw new AppError('Só é possível alterar pedidos que ainda estão em aberto.', 409);
  }
}

function handleAuth(method: Method, path: string, body: unknown): PlaceholderResponse<unknown> {
  if (method === 'POST' && path === '/auth/login') {
    const { email, senha } = body as LoginRequestDto;
    const user = database.users.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!user || user.senha !== senha) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const response: AuthResponseDto = {
      token: TOKEN_PREFIX + user.id,
      usuario: toPublicUser(user),
    };
    return { data: response, status: 200 };
  }

  if (method === 'POST' && path === '/auth/register') {
    const input = body as RegisterRequestDto;
    const email = input.email.trim().toLowerCase();

    if (database.users.some((candidate) => candidate.email.toLowerCase() === email)) {
      throw new AppError('Este e-mail já está cadastrado.', 409);
    }

    const user: PlaceholderUser = {
      id: nextId('u'),
      nome: input.nome.trim(),
      email,
      senha: input.senha,
      papel: 'CIDADAO',
      telefone: input.telefone,
      cidade: input.cidade,
    };
    database.users.push(user);

    const response: AuthResponseDto = {
      token: TOKEN_PREFIX + user.id,
      usuario: toPublicUser(user),
    };
    return { data: response, status: 201 };
  }

  throw new AppError('Rota não encontrada.', 404);
}

function handleHelpRequests(
  method: Method,
  segments: string[],
  body: unknown,
): PlaceholderResponse<unknown> {
  const user = requireUser();
  const [, id, action] = segments;

  if (!id && method === 'GET') {
    const visible =
      user.papel === 'EQUIPE'
        ? database.helpRequests
        : database.helpRequests.filter((request) => request.solicitante?.id === user.id);
    return { data: visible, status: 200 };
  }

  if (!id && method === 'POST') {
    const input = body as SolicitacaoRequestDto;
    const created: SolicitacaoDto = {
      ...input,
      id: nextId('s'),
      status: 'ABERTA',
      prioridade: calculatePriority(input),
      solicitante: { id: user.id, nome: user.nome },
      criadaEm: now(),
      atualizadaEm: now(),
    };
    database.helpRequests.unshift(created);
    return { data: created, status: 201 };
  }

  const request = findHelpRequest(id);

  if (action === 'status' && method === 'PATCH') {
    requireTeam(user);
    request.status = (body as StatusRequestDto).status;
    request.atualizadaEm = now();
    return { data: request, status: 200 };
  }

  if (method === 'GET') {
    if (user.papel !== 'EQUIPE' && request.solicitante?.id !== user.id) {
      throw new AppError('Você não tem permissão para ver este pedido.', 403);
    }
    return { data: request, status: 200 };
  }

  if (method === 'PUT') {
    assertOwnOpenRequest(user, request);
    const input = body as SolicitacaoRequestDto;
    Object.assign(request, input, { prioridade: calculatePriority(input), atualizadaEm: now() });
    return { data: request, status: 200 };
  }

  if (method === 'DELETE') {
    assertOwnOpenRequest(user, request);
    database.helpRequests = database.helpRequests.filter((candidate) => candidate !== request);
    return { data: null, status: 204 };
  }

  throw new AppError('Rota não encontrada.', 404);
}

function handleWaterPoints(
  method: Method,
  segments: string[],
  body: unknown,
): PlaceholderResponse<unknown> {
  const user = requireUser();
  const [, id] = segments;

  if (!id && method === 'GET') {
    return { data: database.waterPoints, status: 200 };
  }

  if (!id && method === 'POST') {
    requireTeam(user);
    const created: PontoAguaDto = {
      ...(body as PontoAguaRequestDto),
      id: nextId('p'),
      atualizadoEm: now(),
    };
    database.waterPoints.unshift(created);
    return { data: created, status: 201 };
  }

  const point = findWaterPoint(id);

  if (method === 'GET') {
    return { data: point, status: 200 };
  }

  if (method === 'PUT') {
    requireTeam(user);
    Object.assign(point, body as PontoAguaRequestDto, { atualizadoEm: now() });
    return { data: point, status: 200 };
  }

  if (method === 'DELETE') {
    requireTeam(user);
    database.waterPoints = database.waterPoints.filter((candidate) => candidate !== point);
    return { data: null, status: 204 };
  }

  throw new AppError('Rota não encontrada.', 404);
}

async function request<T>(
  method: Method,
  url: string,
  body?: unknown,
): Promise<PlaceholderResponse<T>> {
  await simulateLatency();

  const path = url.split('?')[0];
  const segments = path.split('/').filter(Boolean);
  // Devolve cópias para as telas nunca alterarem o "banco" diretamente.
  const clone = (response: PlaceholderResponse<unknown>) =>
    JSON.parse(JSON.stringify(response)) as PlaceholderResponse<T>;

  switch (segments[0]) {
    case 'auth':
      return clone(handleAuth(method, path, body));
    case 'solicitacoes':
      return clone(handleHelpRequests(method, segments, body));
    case 'pontos-agua':
      return clone(handleWaterPoints(method, segments, body));
    case 'regioes':
      requireUser();
      return clone({ data: database.regions as RegiaoDto[], status: 200 });
    default:
      throw new AppError('Rota não encontrada.', 404);
  }
}

export const placeholderApi = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body),
  put: <T>(url: string, body?: unknown) => request<T>('PUT', url, body),
  patch: <T>(url: string, body?: unknown) => request<T>('PATCH', url, body),
  delete: <T>(url: string) => request<T>('DELETE', url),
};
