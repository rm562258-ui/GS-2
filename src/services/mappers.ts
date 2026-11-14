// Conversão entre o JSON da API (DTOs) e os modelos usados pelas telas.
import type {
  AuthResponseDto,
  ListResponseDto,
  PontoAguaDto,
  PontoAguaRequestDto,
  RegiaoDto,
  SolicitacaoDto,
  SolicitacaoRequestDto,
  UsuarioDto,
} from '@/types/api';
import type {
  AffectedRegion,
  AuthSession,
  HelpRequest,
  HelpRequestInput,
  User,
  UserRole,
  WaterPoint,
  WaterPointInput,
} from '@/types/models';

const TEAM_ROLES = ['EQUIPE', 'GESTOR', 'ADMIN', 'AGENTE'];

export function toUserRole(role: string): UserRole {
  const normalized = role.toUpperCase().replace(/^ROLE_/, '');
  return TEAM_ROLES.includes(normalized) ? 'EQUIPE' : 'CIDADAO';
}

export function unwrapList<T>(data: ListResponseDto<T>): T[] {
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export function toUser(dto: UsuarioDto): User {
  return {
    id: String(dto.id),
    name: dto.nome,
    email: dto.email,
    role: toUserRole(String(dto.papel)),
    phone: dto.telefone ?? undefined,
    city: dto.cidade ?? undefined,
  };
}

export function toAuthSession(dto: AuthResponseDto): AuthSession {
  return { token: dto.token, user: toUser(dto.usuario) };
}

export function toHelpRequest(dto: SolicitacaoDto): HelpRequest {
  return {
    id: String(dto.id),
    type: dto.tipo,
    description: dto.descricao,
    peopleCount: dto.quantidadePessoas,
    urgency: dto.urgencia,
    hasVulnerablePeople: dto.grupoVulneravel,
    address: dto.endereco,
    city: dto.cidade,
    latitude: dto.latitude ?? undefined,
    longitude: dto.longitude ?? undefined,
    status: dto.status,
    priority: dto.prioridade ?? undefined,
    aiAnalysis: dto.analiseIa ?? undefined,
    requester: {
      id: String(dto.solicitante?.id ?? ''),
      name: dto.solicitante?.nome ?? 'Cidadão',
    },
    createdAt: dto.criadaEm,
    updatedAt: dto.atualizadaEm ?? dto.criadaEm,
  };
}

export function toHelpRequestDto(input: HelpRequestInput): SolicitacaoRequestDto {
  return {
    tipo: input.type,
    descricao: input.description.trim(),
    quantidadePessoas: input.peopleCount,
    urgencia: input.urgency,
    grupoVulneravel: input.hasVulnerablePeople,
    endereco: input.address.trim(),
    cidade: input.city.trim(),
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
  };
}

export function toWaterPoint(dto: PontoAguaDto): WaterPoint {
  return {
    id: String(dto.id),
    name: dto.nome,
    type: dto.tipo,
    address: dto.endereco,
    city: dto.cidade,
    latitude: dto.latitude,
    longitude: dto.longitude,
    status: dto.status,
    capacityLiters: dto.capacidadeLitros,
    availableLiters: dto.estoqueLitros,
    openingHours: dto.horarioFuncionamento,
    contactPhone: dto.telefone ?? undefined,
    updatedAt: dto.atualizadoEm ?? new Date().toISOString(),
  };
}

export function toWaterPointDto(input: WaterPointInput): PontoAguaRequestDto {
  return {
    nome: input.name.trim(),
    tipo: input.type,
    endereco: input.address.trim(),
    cidade: input.city.trim(),
    latitude: input.latitude,
    longitude: input.longitude,
    status: input.status,
    capacidadeLitros: input.capacityLiters,
    estoqueLitros: input.availableLiters,
    horarioFuncionamento: input.openingHours.trim(),
    telefone: input.contactPhone?.trim() || null,
  };
}

export function toAffectedRegion(dto: RegiaoDto): AffectedRegion {
  return {
    id: String(dto.id),
    name: dto.nome,
    city: dto.cidade,
    riskLevel: dto.nivelRisco,
    situation: dto.situacao,
    description: dto.descricao,
    affectedPopulation: dto.populacaoAfetada ?? undefined,
    updatedAt: dto.atualizadoEm ?? new Date().toISOString(),
  };
}
