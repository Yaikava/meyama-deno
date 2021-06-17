module.exports = {
  apps: [
    {
      name: "meyama_dev",
      script: ".",
      //options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      autorestart: true,
      watch: false,
      interpreter: "deno",
      interpreterArgs: "run --allow-net --allow-read mod.ts",
    },
  ],
};
