const CHECKOUT_DRAFT_KEY = 'sunka_checkout_draft'
const CHECKOUT_DRAFT_VERSION = 1
const CHECKOUT_DRAFT_MAX_AGE = 2 * 60 * 60 * 1000

function stableStringify(value) {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
    if (value && typeof value === 'object') {
        return `{${Object.keys(value)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
            .join(',')}}`
    }
    return JSON.stringify(value)
}

function hash(value) {
    let result = 2166136261
    for (let index = 0; index < value.length; index++) {
        result ^= value.charCodeAt(index)
        result = Math.imul(result, 16777619)
    }
    return (result >>> 0).toString(36)
}

function allowedForm(form) {
    return {
        socio_datos: {
            correo: form.socio_datos?.correo || '',
            telefono: form.socio_datos?.telefono || '',
            nombres: form.socio_datos?.nombres || '',
            doc_tipo: form.socio_datos?.doc_tipo ?? null,
            doc_numero: form.socio_datos?.doc_numero || '',
        },
        entrega_tipo: form.entrega_tipo,
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

export function createCheckoutCartSignature(items) {
    const cart = items
        .map((item) => ({
            articulo: item.articulo,
            cantidad: Number(item.cantidad || 0),
            pu: Number(item.pu || 0),
            blend_datos: item.blend_datos || null,
        }))
        .sort((first, second) => stableStringify(first).localeCompare(stableStringify(second)))

    return hash(stableStringify(cart))
}

export const CheckoutDraft = {
    get({ userId, cartSignature }) {
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

    save({ userId, cartSignature, step, form }) {
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
