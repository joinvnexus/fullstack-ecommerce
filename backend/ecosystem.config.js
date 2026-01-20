module.exports = {
  apps: [
    {
      name: 'ecommerce-backend',
      script: 'dist/index.js',
      instances: process.env.NODE_ENV === 'production' ? 2 : 1,
      exec_mode: process.env.NODE_ENV === 'production' ? 'cluster' : 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 10,
      // Health check
      health_check: {
        enabled: true,
        url: 'http://localhost:5000/api/health',
        interval: 30000, // 30 seconds
        timeout: 5000,   // 5 seconds
        unhealthy_threshold: 3,
        healthy_threshold: 2
      }
    }
  ]
};