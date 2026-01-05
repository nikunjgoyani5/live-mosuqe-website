module.exports = {
  apps: [
    {
      name: "nextjs-livemosque",
      script: "npm",
      args: "start",

      // 🔒 Force SINGLE instance
      exec_mode: "fork",
      instances: 1,

      // Environment
      env: {
        NODE_ENV: "production",
      },

      // Load .env file
      env_file: ".env",
    },
  ],
};
