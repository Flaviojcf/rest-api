import fastify from 'fastify'
import { knexDatabase } from './database'

const app = fastify()

app.get('/hello', async () => {
  const tables = await knexDatabase('sqlite_schema').select('*')
  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Sever is Running!')
  })
