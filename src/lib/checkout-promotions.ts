export const STANDARD_DELIVERY_COST = 10
export const GENERAL_FREE_SHIPPING_MINIMUM = 75
export const CLUB_FREE_SHIPPING_MINIMUM = 65
export const CHECKOUT_POLICY_VERSION = 1

type PromotionItem = Record<string, any> & {
    cantidad?: number
    pu?: number
}

export type PromotionRequirement = {
    line: string
    presentation: number
    quantity: number
}

export type PromotionRule = {
    key: string
    name: string
    audience: 'general' | 'club'
    requirements: PromotionRequirement[]
    mysteryBox?: boolean
}

export type PromotionBenefit = {
    type: 'envio_gratis' | 'caja_sorpresa'
    label: string
    quantity?: number
}

export const CHECKOUT_PROMOTION_RULES: PromotionRule[] = [
    {
        key: 'tradicional-general',
        name: 'Pack Tradicional',
        audience: 'general',
        requirements: [
            { line: 'tradicional', presentation: 50, quantity: 3 },
            { line: 'tradicional', presentation: 20, quantity: 2 },
        ],
    },
    {
        key: 'signature-general',
        name: 'Pack Signature',
        audience: 'general',
        requirements: [{ line: 'signature-black', presentation: 20, quantity: 5 }],
    },
    {
        key: 'piramidal-general',
        name: 'Pack Piramidal',
        audience: 'general',
        requirements: [{ line: 'piramidal-premium', presentation: 10, quantity: 4 }],
    },
    {
        key: 'luxury-general',
        name: 'Pack Luxury',
        audience: 'general',
        requirements: [{ line: 'luxury', presentation: 10, quantity: 3 }],
    },
    {
        key: 'escalera-sunka',
        name: 'Escalera SUNKA',
        audience: 'general',
        requirements: [
            { line: 'tradicional', presentation: 20, quantity: 2 },
            { line: 'signature-black', presentation: 20, quantity: 1 },
            { line: 'piramidal-premium', presentation: 10, quantity: 1 },
            { line: 'luxury', presentation: 10, quantity: 1 },
        ],
    },
    {
        key: 'seleccion-especial',
        name: 'Selección especial',
        audience: 'general',
        requirements: [
            { line: 'signature-black', presentation: 20, quantity: 1 },
            { line: 'piramidal-premium', presentation: 10, quantity: 2 },
            { line: 'luxury', presentation: 10, quantity: 1 },
        ],
    },
    {
        key: 'descubre-sunka',
        name: 'Descubre SUNKA',
        audience: 'general',
        requirements: [
            { line: 'tradicional', presentation: 50, quantity: 1 },
            { line: 'signature-black', presentation: 20, quantity: 1 },
            { line: 'piramidal-premium', presentation: 10, quantity: 1 },
            { line: 'luxury', presentation: 10, quantity: 1 },
        ],
    },
    {
        key: 'tradicional-club',
        name: 'Pack Tradicional Club',
        audience: 'club',
        requirements: [
            { line: 'tradicional', presentation: 50, quantity: 3 },
            { line: 'tradicional', presentation: 20, quantity: 2 },
        ],
    },
    {
        key: 'signature-club',
        name: 'Pack Signature Club',
        audience: 'club',
        requirements: [{ line: 'signature-black', presentation: 20, quantity: 5 }],
    },
    {
        key: 'piramidal-club',
        name: 'Pack Piramidal Club',
        audience: 'club',
        mysteryBox: true,
        requirements: [{ line: 'piramidal-premium', presentation: 10, quantity: 4 }],
    },
    {
        key: 'luxury-club',
        name: 'Pack Luxury Club',
        audience: 'club',
        mysteryBox: true,
        requirements: [{ line: 'luxury', presentation: 10, quantity: 3 }],
    },
    {
        key: 'welcome-club',
        name: 'Welcome to the Club',
        audience: 'club',
        requirements: [
            { line: 'tradicional', presentation: 50, quantity: 1 },
            { line: 'signature-black', presentation: 20, quantity: 1 },
            { line: 'piramidal-premium', presentation: 10, quantity: 1 },
            { line: 'luxury', presentation: 10, quantity: 1 },
        ],
    },
    {
        key: 'flexday',
        name: 'Flexday',
        audience: 'club',
        requirements: [
            { line: 'tradicional', presentation: 20, quantity: 2 },
            { line: 'tradicional', presentation: 50, quantity: 1 },
            { line: 'signature-black', presentation: 20, quantity: 1 },
            { line: 'piramidal-premium', presentation: 10, quantity: 1 },
        ],
    },
    {
        key: 'signature-premium',
        name: 'Signature & Premium',
        audience: 'club',
        mysteryBox: true,
        requirements: [
            { line: 'signature-black', presentation: 20, quantity: 3 },
            { line: 'piramidal-premium', presentation: 10, quantity: 2 },
        ],
    },
    {
        key: 'premium-luxury',
        name: 'Premium & Luxury',
        audience: 'club',
        mysteryBox: true,
        requirements: [
            { line: 'piramidal-premium', presentation: 10, quantity: 3 },
            { line: 'luxury', presentation: 10, quantity: 1 },
        ],
    },
    {
        key: 'luxury-moment',
        name: 'Luxury Moment',
        audience: 'club',
        mysteryBox: true,
        requirements: [
            { line: 'luxury', presentation: 10, quantity: 2 },
            { line: 'piramidal-premium', presentation: 10, quantity: 1 },
        ],
    },
]

const lineLabels: Record<string, string> = {
    tradicional: 'Tradicional',
    'signature-black': 'Signature',
    'piramidal-premium': 'Piramidal Premium',
    luxury: 'Luxury',
}

function joinRequirementTexts(values: string[]) {
    if (values.length <= 1) return values[0] || ''
    return `${values.slice(0, -1).join(', ')} y ${values.at(-1)}`
}

export function getPromotionRequirementText(rule: PromotionRule) {
    return joinRequirementTexts(rule.requirements.map((requirement) => {
        const boxes = requirement.quantity === 1 ? 'caja' : 'cajas'
        return `${requirement.quantity} ${boxes} ${lineLabels[requirement.line] || requirement.line} de ${requirement.presentation} saquitos`
    }))
}

export function getPromotionBenefits(rule: PromotionRule): PromotionBenefit[] {
    return [
        { type: 'envio_gratis', label: 'Envío gratis' },
        ...(rule.mysteryBox
            ? [{ type: 'caja_sorpresa', label: 'Caja sorpresa', quantity: 1 } satisfies PromotionBenefit]
            : []),
    ]
}

export function getPromotionShopHref(rule: PromotionRule) {
    const lines = [...new Set(rule.requirements.map((requirement) => requirement.line))]
    return `/tienda?linea=${lines.map(encodeURIComponent).join(',')}`
}

export function isMixedPromotion(rule: PromotionRule) {
    return new Set(rule.requirements.map((requirement) => requirement.line)).size > 1
}

function normalizeSlug(value: unknown) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export function getProductLine(item: PromotionItem) {
    return normalizeSlug(item.linea_nombre || item.linea1?.nombre || item.lineName)
}

export function getProductPresentation(item: PromotionItem) {
    const presentation = item.presentacion || item.ecommerce_data?.presentacion || []
    const sachets = Array.isArray(presentation)
        ? presentation.find((entry) => normalizeSlug(entry?.label) === 'saquitos')
        : null
    const value = Number(sachets?.value)
    return Number.isFinite(value) ? value : null
}

export function evaluateCheckoutPromotions(
    items: PromotionItem[],
    { isClubMember = false, deliveryType = 'envio' } = {},
) {
    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.pu || 0) * Number(item.cantidad || 0),
        0,
    )
    const quantities = new Map<string, number>()
    for (const item of items) {
        const line = getProductLine(item)
        const presentation = getProductPresentation(item)
        if (!line || presentation == null) continue
        const key = `${line}:${presentation}`
        quantities.set(key, (quantities.get(key) || 0) + Number(item.cantidad || 0))
    }

    const audience = isClubMember ? 'club' : 'general'
    const eligiblePromotions = CHECKOUT_PROMOTION_RULES.filter(
        (rule) =>
            rule.audience === audience &&
            rule.requirements.every(
                (requirement) =>
                    (quantities.get(`${requirement.line}:${requirement.presentation}`) || 0) >=
                    requirement.quantity,
            ),
    )
    const selectedPromotion =
        [...eligiblePromotions].sort((first, second) => {
            const firstLineCount = new Set(
                first.requirements.map((requirement) => requirement.line),
            ).size
            const secondLineCount = new Set(
                second.requirements.map((requirement) => requirement.line),
            ).size
            if (firstLineCount !== secondLineCount) return secondLineCount - firstLineCount

            const firstQuantity = first.requirements.reduce(
                (sum, requirement) => sum + requirement.quantity,
                0,
            )
            const secondQuantity = second.requirements.reduce(
                (sum, requirement) => sum + requirement.quantity,
                0,
            )
            if (firstQuantity !== secondQuantity) return secondQuantity - firstQuantity

            return first.key.localeCompare(second.key)
        })[0] || null
    const matchedPromotions = selectedPromotion ? [selectedPromotion] : []
    const freeShippingMinimum = isClubMember
        ? CLUB_FREE_SHIPPING_MINIMUM
        : GENERAL_FREE_SHIPPING_MINIMUM
    const freeShippingByAmount = subtotal >= freeShippingMinimum
    const freeShippingByPromotion = Boolean(selectedPromotion)
    const deliveryCost =
        deliveryType === 'envio' && !freeShippingByAmount && !freeShippingByPromotion
            ? STANDARD_DELIVERY_COST
            : 0
    const appliedPromotions =
        deliveryType === 'envio'
            ? selectedPromotion
                ? [
                      {
                          key: selectedPromotion.key,
                          name: selectedPromotion.name,
                          benefits: getPromotionBenefits(selectedPromotion),
                      },
                  ]
                : freeShippingByAmount
                  ? [
                        {
                            key: isClubMember ? 'free-shipping-club' : 'free-shipping-general',
                            name: isClubMember
                                ? `Envío gratis Club por compras desde S/ ${freeShippingMinimum}`
                                : `Envío gratis por compras desde S/ ${freeShippingMinimum}`,
                            benefits: [
                                { type: 'envio_gratis', label: 'Envío gratis' },
                            ] satisfies PromotionBenefit[],
                        },
                    ]
                  : []
            : []

    return {
        subtotal,
        deliveryCost,
        total: subtotal + deliveryCost,
        freeShippingMinimum,
        missingForFreeShipping: Math.max(0, freeShippingMinimum - subtotal),
        hasFreeShipping: deliveryType !== 'envio' || deliveryCost === 0,
        matchedPromotions,
        appliedPromotions,
    }
}
