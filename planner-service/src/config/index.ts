export default {
  server: {
    port: process.env.SERVER_PORT,
  },
  database: {
    connectionString: process.env.DATABASE_CONNECTIONSTRING,
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
}
