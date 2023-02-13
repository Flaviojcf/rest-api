import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knexDatabase } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knexDatabase('transactions').select('*')

    return {
      transactions,
    }
  })

  app.get('/:id', async (request) => {
    const getTransactionParamSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionParamSchema.parse(request.params)

    const transaction = await knexDatabase('transactions')
      .where('id', id)
      .first()

    return {
      transaction,
    }
  })

  app.get('/summary', async () => {
    const summary = await knexDatabase('transactions')
      .sum('amount', { as: 'amount' })
      .first()
    return {
      summary,
    }
  })

  app.post('/', async (request, reply) => {
    const createTransactionBodyScema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
    const { title, amount, type } = createTransactionBodyScema.parse(
      request.body,
    )

    await knexDatabase('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })
    return reply.status(201).send()
  })
}
