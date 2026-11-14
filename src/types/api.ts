// Formato do JSON trocado com a API (contrato). Os serviços convertem para os modelos do app.
import type {
  HelpRequestStatus,
  HelpRequestType,
  RiskLevel,
  Urgency,
  UserRole,
  WaterPointStatus,
  WaterPointType,
} from './models';

export type UsuarioDto = {
  id: string | number;
  nome: string;
  email: string;
  papel: UserRole | string;
  telefone?: string | null;
  cidade?: string | null;
};

export type LoginRequestDto = {
  email: string;
  senha: string;
};

export type RegisterRequestDto = {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  cidade?: string;
};

export type AuthResponseDto = {
  token: string;
  usuario: UsuarioDto;
};

export type SolicitacaoDto = {
  id: string | number;
  tipo: HelpRequestType;
  descricao: string;
  quantidadePessoas: number;
  urgencia: Urgency;
  grupoVulneravel: boolean;
  endereco: string;
  cidade: string;
  latitude?: number | null;
  longitude?: number | null;
  status: HelpRequestStatus;
  prioridade?: number | null;
  analiseIa?: string | null;
  solicitante?: { id: string | number; nome: string } | null;
  criadaEm: string;
  atualizadaEm?: string | null;
};

export type SolicitacaoRequestDto = Omit<
  SolicitacaoDto,
  'id' | 'status' | 'prioridade' | 'analiseIa' | 'solicitante' | 'criadaEm' | 'atualizadaEm'
>;

export type StatusRequestDto = {
  status: HelpRequestStatus;
};

export type PontoAguaDto = {
  id: string | number;
  nome: string;
  tipo: WaterPointType;
  endereco: string;
  cidade: string;
  latitude: number;
  longitude: number;
  status: WaterPointStatus;
  capacidadeLitros: number;
  estoqueLitros: number;
  horarioFuncionamento: string;
  telefone?: string | null;
  atualizadoEm?: string | null;
};

export type PontoAguaRequestDto = Omit<PontoAguaDto, 'id' | 'atualizadoEm'>;

export type RegiaoDto = {
  id: string | number;
  nome: string;
  cidade: string;
  nivelRisco: RiskLevel;
  situacao: string;
  descricao: string;
  populacaoAfetada?: number | null;
  atualizadoEm?: string | null;
};

/** Listagens podem vir como array ou paginadas no formato do Spring Data. */
export type PageDto<T> = {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
};

export type ListResponseDto<T> = T[] | PageDto<T>;
