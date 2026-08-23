import type { APIRoute } from 'astro'
import { requestWithSession } from '@/lib/server/backend'
import { json } from '@/lib/server/bff'

export const GET: APIRoute = async (context) => json(await requestWithSession(context, 'customers/me'))
