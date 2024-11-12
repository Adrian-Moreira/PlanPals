export default {
  server: {
    port: process.env.SERVER_PORT,
  },
  database: {
    connectionString: process.env.DATABASE_CONNECTIONSTRING,
  },
  messageQ: {
    connectionString: process.env.RABBITMQ_CONNECTIONSTRING,
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
}
