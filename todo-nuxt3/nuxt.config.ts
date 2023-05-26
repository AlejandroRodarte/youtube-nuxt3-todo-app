const hmrPort =
  process.env.STAGE === 'development-docker'
    ? +(process.env.HMR_PORT || '3001')
    : undefined;

// https://nuxt.com/docs/api/configuration/nuxt-config
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
    server: {
      hmr: {
        port: hmrPort,
      },
    },
  },
});
