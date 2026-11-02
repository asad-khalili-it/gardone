module.exports = {
  apps: [
    {
      name: "gardone",
      script: "npm",
      args: "start -- -p 3042",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3042
      }
    }
  ]
};

