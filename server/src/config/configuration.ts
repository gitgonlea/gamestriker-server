export default () => ({
    environment: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      name: process.env.DB_NAME || 'argstrike',
    }, 
    timezone: 'America/Argentina/Buenos_Aires',
    server: {
      updateInterval: parseInt(process.env.SERVER_UPDATE_INTERVAL, 10) || 900000, // Default: 15 minutes
      queryTimeout: parseInt(process.env.SERVER_QUERY_TIMEOUT, 10) || 1000, // Default: 1 second
    },
    bannerSettings: {
      outputPath: process.env.BANNER_OUTPUT_PATH || 'public/server_info',
    },
  });