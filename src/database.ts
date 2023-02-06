import { knex, Knex } from 'knex'

export const knextConfig: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  }
}

export const knexDatabase = knex(knextConfig)
