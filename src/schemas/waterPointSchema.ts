import { z } from 'zod';

const waterPointTypes = ['POSTO_DISTRIBUICAO', 'CAMINHAO_PIPA', 'RESERVATORIO', 'ABRIGO'] as const;
const waterPointStatuses = ['DISPONIVEL', 'ESTOQUE_BAIXO', 'ESGOTADO', 'FECHADO'] as const;

const litersField = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, `Informe ${label} em litros (somente números).`)
    .transform(Number);

// Aceita vírgula ou ponto como separador decimal (ex.: -30,0346).
const coordinateField = (label: 'latitude' | 'longitude', limit: number) => {
  const invalidMessage = label === 'latitude' ? 'Latitude inválida.' : 'Longitude inválida.';

  return z
    .string()
    .trim()
    .min(1, `Informe a ${label} ou use sua localização.`)
    .transform((value) => Number(value.replace(',', '.')))
    .pipe(z.number(invalidMessage).min(-limit, invalidMessage).max(limit, invalidMessage));
};

export const waterPointSchema = z
  .object({
    name: z.string().trim().min(3, 'Informe o nome do ponto.'),
    type: z.enum(waterPointTypes, 'Escolha o tipo do ponto.'),
    status: z.enum(waterPointStatuses, 'Escolha a situação do ponto.'),
    address: z.string().trim().min(5, 'Informe o endereço.'),
    city: z.string().trim().min(2, 'Informe a cidade.'),
    latitude: coordinateField('latitude', 90),
    longitude: coordinateField('longitude', 180),
    capacityLiters: litersField('a capacidade'),
    availableLiters: litersField('o estoque'),
    openingHours: z.string().trim().min(3, 'Informe o horário de funcionamento.'),
    contactPhone: z.string().trim(),
  })
  .refine((data) => data.availableLiters <= data.capacityLiters, {
    message: 'O estoque não pode ser maior que a capacidade.',
    path: ['availableLiters'],
  });

export type WaterPointFormInput = z.input<typeof waterPointSchema>;
export type WaterPointFormOutput = z.output<typeof waterPointSchema>;
