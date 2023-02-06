import { knex } from 'knex'

export const knexDatabase = knex({
  client: 'sqlite',
  connection: {
    filename: './tmp/app.db',
  },
  useNullAsDefault: true,
})
