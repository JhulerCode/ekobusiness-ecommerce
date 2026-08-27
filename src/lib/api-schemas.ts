import { z } from 'zod'

const email = z.string().trim().email().max(254)
const identifier = z.string().trim().min(1).max(100)

export const newsletterSchema = z.object({ correo: email }).strict()

export const signInSchema = z
    .object({ correo: email, contrasena: z.string().min(1).max(200) })
    .passthrough()

export const registerSchema = signInSchema.extend({
    nombres: z.string().trim().min(1).max(150).optional(),
    apellidos: z.string().trim().min(1).max(150).optional(),
    telefono: z.string().trim().max(30).optional(),
    contrasena_confirmar: z.string().min(1).max(200).optional(),
})

export const orderLookupSchema = z
    .object({ codigo: z.string().trim().min(1).max(30), codigo_consulta: z.string().regex(/^\d{6}$/) })
    .strict()

export const orderResendSchema = z
    .object({ codigo: z.string().trim().min(1).max(30), correo: email })
    .strict()

export const accountCodeSchema = z.object({ correo: email }).passthrough()
export const accountVerifySchema = z
    .object({ correo: email, codigo_verificacion: z.string().trim().min(1).max(20) })
    .passthrough()
export const accountPasswordSchema = z
    .object({ id: identifier, contrasena: z.string().min(8).max(200) })
    .passthrough()

export const idSchema = identifier

export const jsonObjectSchema = z.record(z.string(), z.unknown())

export const orderCreateSchema = z
    .object({
        codigo: identifier,
        socio_datos: jsonObjectSchema,
    })
    .passthrough()

export const createPaymentSchema = z
    .object({
        correo: email,
        paymentMethodToken: z.string().max(500).optional(),
        socio_pedido: jsonObjectSchema,
    })
    .strict()

export const validatePaymentSchema = z
    .object({ paymentData: jsonObjectSchema, checkout_intent_id: identifier })
    .strict()

export const complaintSchema = z
    .object({ correo: email, detalle: z.string().trim().min(1).max(20_000) })
    .passthrough()

export const arcoMetadataSchema = z.record(
    z.string().max(100),
    z.union([z.string().max(10_000), z.number(), z.boolean(), z.null()]),
)

export const allowedUploadTypes = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
])

export const maxUploadBytes = 5 * 1024 * 1024
