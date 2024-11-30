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
  ws: {
    connectionString: process.env.WS_CONNECTIONSTRING,
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
}
