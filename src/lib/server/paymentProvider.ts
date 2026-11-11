export const paymentProviders = ['izipay', 'niubiz'] as const

export type PaymentProvider = (typeof paymentProviders)[number]

export function activePaymentProvider(): PaymentProvider {
    const configured = process.env.PAYMENT_PROVIDER ?? import.meta.env.PAYMENT_PROVIDER
    const value = String(configured || 'izipay').trim().toLowerCase()
    return paymentProviders.includes(value as PaymentProvider)
        ? (value as PaymentProvider)
        : 'izipay'
}
