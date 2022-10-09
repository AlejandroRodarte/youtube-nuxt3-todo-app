const cacheDir =
  process.env.STAGE === 'development-docker'
    ? '/node/node_modules/.vite'
    : 'node_modules/.vite';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  vite: {
    cacheDir,
  },
});
