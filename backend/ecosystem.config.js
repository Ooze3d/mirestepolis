module.exports = {
    apps : [{
      name: 'my-pm2-process-name',
      script: 'server.js',
  
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
  
      instances: 1,
      watch: true,
      ignore_watch: [".git/index.lock", "logs", "public", "node_modules", "[\\/\\\\]\\./","pids", ".git", ".idea"],
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }]
  };