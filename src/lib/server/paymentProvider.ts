export const paymentProviders = ['izipay', 'niubiz'] as const

export type PaymentProvider = (typeof paymentProviders)[number]

export function activePaymentProvider(): PaymentProvider {
    const value = String(process.env.PAYMENT_PROVIDER || 'izipay').trim().toLowerCase()
    return paymentProviders.includes(value as PaymentProvider)
        ? (value as PaymentProvider)
        : 'izipay'
}
