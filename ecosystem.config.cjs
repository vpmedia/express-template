module.exports = {
  apps: [
    {
      script: "./build/server.js",
      watch: "./build",
      log_type: "json",
      node_args: "--experimental-modules",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
