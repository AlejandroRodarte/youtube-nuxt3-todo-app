const cacheDir =
  process.env.STAGE === 'development-docker'
    ? '/node/node_modules/.vite'
    : 'node_modules/.vite';

const hmrPort =
  process.env.STAGE === 'development-docker'
    ? +process.env.HMR_PORT
    : undefined;

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  vite: {
    cacheDir,
    server: {
      hmr: {
        port: hmrPort,
      },
    },
  },
});
