import fastify from 'fastify'
import { knexDatabase } from './database'
import crypto from 'node:crypto'

const app = fastify()

app.get('/hello', async () => {
  const transactions = await knexDatabase('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transação de teste',
    amount: 1000
  }).returning('*')
  return transactions
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Sever is Running!')
  })
