import { z } from 'zod';

const helpRequestTypes = ['FALTA_DE_AGUA', 'AGUA_CONTAMINADA', 'ENTREGA_DE_AGUA', 'OUTRO'] as const;
const urgencies = ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] as const;

export const helpRequestSchema = z.object({
  type: z.enum(helpRequestTypes, 'Escolha o tipo de ajuda.'),
  urgency: z.enum(urgencies, 'Escolha a urgência.'),
  peopleCount: z
    .string()
    .trim()
    .regex(/^\d+$/, 'Informe quantas pessoas precisam de água.')
    .transform(Number)
    .pipe(
      z
        .number()
        .min(1, 'Informe pelo menos 1 pessoa.')
        .max(500, 'Para mais de 500 pessoas, procure a Defesa Civil.'),
    ),
  hasVulnerablePeople: z.boolean(),
  description: z
    .string()
    .trim()
    .min(10, 'Descreva a situação com pelo menos 10 caracteres.')
    .max(500, 'Use no máximo 500 caracteres.'),
  address: z.string().trim().min(5, 'Informe o endereço com rua e número.'),
  city: z.string().trim().min(2, 'Informe a cidade.'),
});

export type HelpRequestFormInput = z.input<typeof helpRequestSchema>;
export type HelpRequestFormOutput = z.output<typeof helpRequestSchema>;
