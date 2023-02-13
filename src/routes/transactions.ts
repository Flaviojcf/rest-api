import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knexDatabase } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const transactions = await knexDatabase('transactions')
        .where('session_id', sessionId)
        .select('*')

      return {
        transactions,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getTransactionParamSchema.parse(request.params)
      const { sessionId } = request.cookies

      const transaction = await knexDatabase('transactions')
        .where({ session_id: sessionId, id })
        .first()

      return {
        transaction,
      }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knexDatabase('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()
      return {
        summary,
      }
    },
  )

  app.post(
    '/',

    async (request, reply) => {
      const createTransactionBodyScema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit']),
      })
      const { title, amount, type } = createTransactionBodyScema.parse(
        request.body,
      )

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()
        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // last number is a count of daysy
        })
      }

      await knexDatabase('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })
      return reply.status(201).send()
    },
  )
}
