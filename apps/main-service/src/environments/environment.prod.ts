export const environment = {
  production: true,
  app: {
    name: process.env.MAIN_SERVICE_APP_NAME,
    port: process.env.MAIN_SERVICE_APP_PORT,
    url: process.env.MAIN_SERVICE_APP_URL,
  },
  database: {
    type: process.env.MAIN_SERVICE_DATABASE_TYPE,
    host: process.env.MAIN_SERVICE_DATABASE_HOST,
    port: process.env.MAIN_SERVICE_DATABASE_PORT,
    username: process.env.MAIN_SERVICE_DATABASE_USERNAME,
    password: process.env.MAIN_SERVICE_DATABASE_PASSWORD,
    name: process.env.MAIN_SERVICE_DATABASE_NAME,
    synchronize: process.env.MAIN_SERVICE_DATABASE_SYNCHRONIZE === 'true',
    autoLoadEntities: false,
  },
};
