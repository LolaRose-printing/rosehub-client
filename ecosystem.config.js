module.exports = {
  apps: [
    {
      name: "rosehub-client",
      script: "npm",
      args: "run start",
      cwd: "/etc/apps/rosehub-client",
      env: {
        NODE_ENV: "production"
      },
      watch: false,
      autorestart: true
    }
  ]
}
