// Modelos usados pelas telas. Os valores dos enums seguem o contrato da API.

export type UserRole = 'CIDADAO' | 'EQUIPE';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
};

export type AuthSession = {
  token: string;
  user: User;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
};

export type HelpRequestType = 'FALTA_DE_AGUA' | 'AGUA_CONTAMINADA' | 'ENTREGA_DE_AGUA' | 'OUTRO';

export type Urgency = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type HelpRequestStatus = 'ABERTA' | 'EM_ATENDIMENTO' | 'ATENDIDA' | 'CANCELADA';

export type HelpRequest = {
  id: string;
  type: HelpRequestType;
  description: string;
  peopleCount: number;
  urgency: Urgency;
  hasVulnerablePeople: boolean;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  status: HelpRequestStatus;
  /** Prioridade calculada pela API (0 a 100). */
  priority?: number;
  /** Análise gerada pela API, quando disponível. */
  aiAnalysis?: string;
  requester: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
};

export type HelpRequestInput = {
  type: HelpRequestType;
  description: string;
  peopleCount: number;
  urgency: Urgency;
  hasVulnerablePeople: boolean;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
};

export type WaterPointType = 'POSTO_DISTRIBUICAO' | 'CAMINHAO_PIPA' | 'RESERVATORIO' | 'ABRIGO';

export type WaterPointStatus = 'DISPONIVEL' | 'ESTOQUE_BAIXO' | 'ESGOTADO' | 'FECHADO';

export type WaterPoint = {
  id: string;
  name: string;
  type: WaterPointType;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  status: WaterPointStatus;
  capacityLiters: number;
  availableLiters: number;
  openingHours: string;
  contactPhone?: string;
  updatedAt: string;
};

export type WaterPointInput = Omit<WaterPoint, 'id' | 'updatedAt'>;

export type RiskLevel = 'BAIXO' | 'MODERADO' | 'ALTO' | 'CRITICO';

export type AffectedRegion = {
  id: string;
  name: string;
  city: string;
  riskLevel: RiskLevel;
  situation: string;
  description: string;
  affectedPopulation?: number;
  updatedAt: string;
};
