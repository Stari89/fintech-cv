module.exports = {
  apps: [
    {
      name: 'fintech-cv',
      script: 'dist/fintech-cv/server/server.mjs',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        // CONTENT_PATH and DB credentials are set as environment variables on the server
        // Never commit secrets here
      }
    }
  ]
};
