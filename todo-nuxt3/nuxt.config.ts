const hmrPort =
  process.env.STAGE === 'development-docker'
    ? +(process.env.HMR_PORT || '3001')
    : undefined;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  nitro: {
    externals: {
      inline: ['uuid'],
    },
  },
  runtimeConfig: {
    public: {
      stage: process.env.NUXT_PUBLIC_STAGE || 'development-local',
    },
  },
  srcDir: 'src/',
  typescript: {
    strict: true,
  },
  vite: {
    server: {
      hmr: {
        port: hmrPort,
      },
    },
  },
});
