import type { BadgeTone, IconName } from '@/components/ui';
import type {
  HelpRequestStatus,
  HelpRequestType,
  RiskLevel,
  Urgency,
  UserRole,
  WaterPointStatus,
  WaterPointType,
} from '@/types/models';

type Option<T extends string> = { value: T; label: string };

type DisplayInfo = { label: string; tone: BadgeTone; icon?: IconName };

export const userRoleLabels: Record<UserRole, string> = {
  CIDADAO: 'Cidadão',
  EQUIPE: 'Equipe de apoio',
};

export const helpRequestTypeInfo: Record<HelpRequestType, { label: string; icon: IconName }> = {
  FALTA_DE_AGUA: { label: 'Sem água potável', icon: 'water-outline' },
  AGUA_CONTAMINADA: { label: 'Água contaminada', icon: 'warning-outline' },
  ENTREGA_DE_AGUA: { label: 'Preciso de entrega', icon: 'car-outline' },
  OUTRO: { label: 'Outro', icon: 'help-circle-outline' },
};

export const urgencyInfo: Record<Urgency, DisplayInfo> = {
  BAIXA: { label: 'Baixa', tone: 'neutral' },
  MEDIA: { label: 'Média', tone: 'info' },
  ALTA: { label: 'Alta', tone: 'warning' },
  CRITICA: { label: 'Crítica', tone: 'danger' },
};

export const helpRequestStatusInfo: Record<HelpRequestStatus, DisplayInfo> = {
  ABERTA: { label: 'Aberto', tone: 'warning', icon: 'time-outline' },
  EM_ATENDIMENTO: { label: 'Em atendimento', tone: 'info', icon: 'car-outline' },
  ATENDIDA: { label: 'Atendido', tone: 'success', icon: 'checkmark-circle-outline' },
  CANCELADA: { label: 'Cancelado', tone: 'neutral', icon: 'close-circle-outline' },
};

export const waterPointTypeInfo: Record<WaterPointType, { label: string; icon: IconName }> = {
  POSTO_DISTRIBUICAO: { label: 'Posto de distribuição', icon: 'storefront-outline' },
  CAMINHAO_PIPA: { label: 'Caminhão-pipa', icon: 'bus-outline' },
  RESERVATORIO: { label: 'Reservatório', icon: 'beaker-outline' },
  ABRIGO: { label: 'Abrigo', icon: 'home-outline' },
};

export const waterPointStatusInfo: Record<WaterPointStatus, DisplayInfo> = {
  DISPONIVEL: { label: 'Disponível', tone: 'success', icon: 'water' },
  ESTOQUE_BAIXO: { label: 'Estoque baixo', tone: 'warning', icon: 'water-outline' },
  ESGOTADO: { label: 'Esgotado', tone: 'danger', icon: 'close-circle-outline' },
  FECHADO: { label: 'Fechado', tone: 'neutral', icon: 'lock-closed-outline' },
};

export const riskLevelInfo: Record<RiskLevel, DisplayInfo & { weight: number }> = {
  BAIXO: { label: 'Risco baixo', tone: 'success', weight: 1 },
  MODERADO: { label: 'Risco moderado', tone: 'info', weight: 2 },
  ALTO: { label: 'Risco alto', tone: 'warning', weight: 3 },
  CRITICO: { label: 'Risco crítico', tone: 'danger', weight: 4 },
};

const toOptions = <T extends string>(info: Record<T, { label: string }>): Option<T>[] =>
  (Object.keys(info) as T[]).map((value) => ({ value, label: info[value].label }));

export const helpRequestTypeOptions = toOptions(helpRequestTypeInfo);
export const urgencyOptions = toOptions(urgencyInfo);
export const waterPointTypeOptions = toOptions(waterPointTypeInfo);
export const waterPointStatusOptions = toOptions(waterPointStatusInfo);
