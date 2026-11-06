import { z } from 'zod'

const email = z.string().trim().email().max(254)
const identifier = z.string().trim().min(1).max(100)

export const newsletterSchema = z.object({ email }).strict()

export const signInSchema = z
    .object({ email, password: z.string().min(1).max(200) })
    .passthrough()

export const registerSchema = signInSchema.extend({
    nombres: z.string().trim().min(1).max(150).optional(),
    apellidos: z.string().trim().min(1).max(150).optional(),
    telefono: z.string().trim().max(30).optional(),
    password_confirm: z.string().min(1).max(200).optional(),
})

export const orderLookupSchema = z
    .object({ order_code: z.string().trim().min(1).max(30), lookup_code: z.string().regex(/^\d{6}$/) })
    .strict()

export const orderResendSchema = z
    .object({ order_code: z.string().trim().min(1).max(30), email })
    .strict()

export const accountCodeSchema = z.object({ email }).passthrough()
export const accountVerifySchema = z
    .object({ email, verification_code: z.string().trim().min(1).max(20) })
    .passthrough()
export const accountPasswordSchema = z
    .object({ id: identifier, password: z.string().min(8).max(200) })
    .passthrough()

export const idSchema = identifier

export const jsonObjectSchema = z.record(z.string(), z.unknown())

export const PARTNER_ORDER_TYPE = 'sale' as const
export const partnerOrderTypeSchema = z.literal(PARTNER_ORDER_TYPE)

export const PARTNER_ORDER_ORIGIN = 'integration' as const
export const partnerOrderOriginSchema = z.literal(PARTNER_ORDER_ORIGIN)

export const ORDER_CURRENCY = 'PEN' as const
export const orderCurrencySchema = z.literal(ORDER_CURRENCY)

export const orderDeliveryTypeSchema = z.enum(['envio', 'retiro'])
export const orderPaymentMethodSchema = z.enum(['tarjeta', 'yape'])
export const orderInvoiceTypeSchema = z.enum(['03', '01', 'NV'])

export const partnerOrderContractSchema = z
    .object({
        type: partnerOrderTypeSchema.optional(),
        origin: partnerOrderOriginSchema.optional(),
        currency_id: orderCurrencySchema.optional(),
        delivery_type: orderDeliveryTypeSchema.optional(),
        payment_method: orderPaymentMethodSchema.optional(),
        invoice_type: orderInvoiceTypeSchema.optional(),
    })
    .passthrough()

export const orderCreateSchema = z
    .object({
        order_code: identifier,
        partner_data: jsonObjectSchema,
        type: partnerOrderTypeSchema.optional(),
        origin: partnerOrderOriginSchema.optional(),
        currency_id: orderCurrencySchema.optional(),
        delivery_type: orderDeliveryTypeSchema.optional(),
        payment_method: orderPaymentMethodSchema.optional(),
        invoice_type: orderInvoiceTypeSchema.optional(),
    })
    .passthrough()

export const createPaymentSchema = z
    .object({
        email,
        paymentMethodToken: z.string().max(500).optional(),
        partner_order: partnerOrderContractSchema,
    })
    .strict()

export const validatePaymentSchema = z
    .object({ paymentData: jsonObjectSchema, checkout_intent_id: identifier })
    .strict()

export const complaintSchema = z
    .object({ email, description: z.string().trim().min(1).max(20_000) })
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
