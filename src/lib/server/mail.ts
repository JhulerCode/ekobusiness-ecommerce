import nodemailer from 'nodemailer'
import { runtimeEnv } from './backend'

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
    if (transporter) return transporter

    const host = runtimeEnv('SMTP_HOST')
    const user = runtimeEnv('SMTP_USER')
    const pass = runtimeEnv('SMTP_PASS')
    if (!host || !user || !pass) {
        throw new Error('SMTP_HOST, SMTP_USER y SMTP_PASS son obligatorios')
    }

    transporter = nodemailer.createTransport({
        host,
        port: Number(runtimeEnv('SMTP_PORT') || 587),
        secure: runtimeEnv('SMTP_SECURE') === 'true',
        auth: { user, pass },
    })
    return transporter
}

export async function sendMail({
    to,
    subject,
    html,
}: {
    to: string
    subject: string
    html: string
}) {
    const from = runtimeEnv('SMTP_FROM')
    if (!from) throw new Error('SMTP_FROM es obligatorio')

    let lastError: unknown
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            await getTransporter().sendMail({ from, to, subject, html })
            return
        } catch (error) {
            lastError = error
        }
    }
    throw lastError
}
