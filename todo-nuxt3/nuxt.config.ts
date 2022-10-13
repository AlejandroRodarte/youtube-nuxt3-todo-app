const cacheDir =
  process.env.STAGE === 'development-docker'
    ? '/node/node_modules/.vite'
    : 'node_modules/.vite';

const hmrPort =
  process.env.STAGE === 'development-docker'
    ? +(process.env.HMR_PORT || '3001')
    : undefined;

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      stage: process.env.NUXT_PUBLIC_STAGE || 'development-local',
    },
  },
  vite: {
    cacheDir,
    server: {
      hmr: {
        port: hmrPort,
      },
    },
  },
});
