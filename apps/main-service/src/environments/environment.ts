export const environment = {
  production: false,
  app: {
    name: process.env.MAIN_SERVICE_APP_NAME,
    port: process.env.MAIN_SERVICE_APP_PORT,
    url: process.env.MAIN_SERVICE_APP_URL,
  },
  database: {
    type: process.env.MAIN_SERVICE_DATABASE_TYPE,
    port: parseInt(process.env.MAIN_SERVICE_DATABASE_PORT, 10),
    username: process.env.MAIN_SERVICE_DATABASE_USERNAME,
    password: process.env.MAIN_SERVICE_DATABASE_PASSWORD,
    database: process.env.MAIN_SERVICE_DATABASE_NAME,
    synchronize: process.env.MAIN_SERVICE_DATABASE_SYNCHRONIZE === 'true',
    autoLoadEntities: true,
  },
  cache: {
    host: process.env.MAIN_SERVICE_CACHE_HOST,
    port: parseInt(process.env.MAIN_SERVICE_CACHE_PORT, 10),
    db: parseInt(process.env.MAIN_SERVICE_CACHE_DB, 10),
  },
  queue: {
    host: process.env.MAIN_SERVICE_QUEUE_HOST,
    port: parseInt(process.env.MAIN_SERVICE_QUEUE_PORT, 10),
    db: parseInt(process.env.MAIN_SERVICE_QUEUE_DB, 10),
    prefix: process.env.MAIN_SERVICE_QUEUE_PREFIX,
  },
};
