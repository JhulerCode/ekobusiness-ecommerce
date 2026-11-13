const CHECKOUT_DRAFT_KEY = 'sunka_checkout_draft'
const CHECKOUT_DRAFT_VERSION = 1
const CHECKOUT_DRAFT_MAX_AGE = 2 * 60 * 60 * 1000

type DraftRecord = Record<string, any>

function stableStringify(value: unknown): string {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
    if (value && typeof value === 'object') {
        return `{${Object.keys(value)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`)
            .join(',')}}`
    }
    return JSON.stringify(value)
}

function hash(value: string) {
    let result = 2166136261
    for (let index = 0; index < value.length; index++) {
        result ^= value.charCodeAt(index)
        result = Math.imul(result, 16777619)
    }
    return (result >>> 0).toString(36)
}

function allowedForm(form: DraftRecord) {
    return {
        partner_data: {
            email: form.partner_data?.email || '',
            phone1: form.partner_data?.phone1 || '',
            name: form.partner_data?.name || '',
            document_type: form.partner_data?.document_type ?? null,
            document_number: form.partner_data?.document_number || '',
        },
        entrega_tipo: form.entrega_tipo,
        punto_retiro: form.punto_retiro || null,
        direccion_nombre: form.direccion_nombre || '',
        entrega_direccion_id: form.entrega_direccion_id ?? null,
        new_direccion: Boolean(form.new_direccion),
        entrega_ubigeo: form.entrega_ubigeo ?? null,
        direccion_entrega: form.direccion_entrega || '',
        entrega_direccion_datos: {
            numero: form.entrega_direccion_datos?.numero || '',
            piso: form.entrega_direccion_datos?.piso || '',
            referencia: form.entrega_direccion_datos?.referencia || '',
            ubigeo1: form.entrega_direccion_datos?.ubigeo1 || null,
        },
        fecha_entrega: form.fecha_entrega || null,
        comprobante_tipo: form.comprobante_tipo,
        comprobante_ruc: form.comprobante_ruc || '',
        comprobante_razon_social: form.comprobante_razon_social || '',
        pago_metodo: form.pago_metodo,
    }
}

export function createCheckoutCartSignature(items: DraftRecord[]) {
    const cart = items
        .map((item: DraftRecord) => ({
            articulo: item.articulo,
            cantidad: Number(item.cantidad || 0),
            pu: Number(item.pu || 0),
            blend_datos: item.blend_datos || null,
        }))
        .sort((first, second) => stableStringify(first).localeCompare(stableStringify(second)))

    return hash(stableStringify(cart))
}

function compactUbigeo(ubigeo: DraftRecord | null) {
    if (!ubigeo) return null
    return {
        id: ubigeo.id ?? null,
        code: ubigeo.code ?? null,
        department: ubigeo.department ?? ubigeo.departamento ?? null,
        province: ubigeo.province ?? ubigeo.provincia ?? null,
        district: ubigeo.district ?? ubigeo.distrito ?? null,
        full_name: ubigeo.full_name ?? null,
    }
}

export function createCheckoutOrderSignature({
    items,
    form,
    deliveryCost,
}: {
    items: DraftRecord[]
    form: DraftRecord
    deliveryCost: number
}) {
    const partner = form?.partner_data || {}
    const address = form?.entrega_direccion_datos || {}

    return hash(
        stableStringify({
            cart: createCheckoutCartSignature(items || []),
            partner: {
                email: partner.email || '',
                phone1: partner.phone1 || '',
                name: partner.name || '',
                apellidos: partner.apellidos || '',
                document_type: partner.document_type ?? null,
                document_number: partner.document_number || '',
            },
            delivery_type: form?.delivery_type || '',
            punto_retiro: form?.punto_retiro || null,
            delivery_date: form?.delivery_date || null,
            entrega_ubigeo: form?.entrega_ubigeo ?? null,
            direccion_entrega: form?.direccion_entrega || '',
            entrega_direccion_datos: {
                numero: address.numero || '',
                piso: address.piso || '',
                referencia: address.referencia || '',
                horario: address.horario || '',
                punto_retiro: address.punto_retiro || null,
                ubigeo1: compactUbigeo(address.ubigeo1),
            },
            invoice_type: form?.invoice_type || '',
            invoice_ruc: form?.invoice_ruc || '',
            invoice_business_name: form?.invoice_business_name || '',
            payment_method: form?.payment_method || '',
            payment_method_token: form?.paymentMethodToken || '',
            delivery_cost: Number(deliveryCost || 0),
        }),
    )
}

export const CheckoutDraft = {
    get({ userId, cartSignature }: { userId: string | null; cartSignature: string }) {
        try {
            const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY)
            if (!raw) return null

            const draft = JSON.parse(raw)
            const expired = Date.now() - Number(draft.savedAt || 0) > CHECKOUT_DRAFT_MAX_AGE
            const invalidContext =
                draft.version !== CHECKOUT_DRAFT_VERSION ||
                draft.userId !== userId ||
                draft.cartSignature !== cartSignature

            if (expired || invalidContext) {
                this.clear()
                return null
            }

            return draft
        } catch {
            this.clear()
            return null
        }
    },

    save({ userId, cartSignature, step, form }: { userId: string | null; cartSignature: string; step: number; form: DraftRecord }) {
        try {
            sessionStorage.setItem(
                CHECKOUT_DRAFT_KEY,
                JSON.stringify({
                    version: CHECKOUT_DRAFT_VERSION,
                    savedAt: Date.now(),
                    userId,
                    cartSignature,
                    step,
                    form: allowedForm(form),
                }),
            )
        } catch {
            return
        }
    },

    clear() {
        try {
            sessionStorage.removeItem(CHECKOUT_DRAFT_KEY)
        } catch {
            return
        }
    },
}
