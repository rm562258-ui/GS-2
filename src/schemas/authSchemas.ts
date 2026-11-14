import { z } from 'zod';

const emailField = z
  .string()
  .trim()
  .min(1, 'Informe seu e-mail.')
  .pipe(z.email('Informe um e-mail válido.'));

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Informe sua senha.'),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(3, 'Informe seu nome completo.'),
    email: emailField,
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || /^\d{10,11}$/.test(value.replace(/\D/g, '')),
        'Informe um telefone com DDD.',
      ),
    city: z.string().trim(),
    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres.')
      .regex(/[A-Za-z]/, 'A senha deve ter pelo menos uma letra.')
      .regex(/\d/, 'A senha deve ter pelo menos um número.'),
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
