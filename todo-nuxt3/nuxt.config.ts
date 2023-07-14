import setDockerSecrets from './src/lib/env/docker/set-docker-secrets.helper';

const hmrPort =
  process.env.STAGE === 'development-docker'
    ? +(process.env.HMR_PORT || '3001')
    : undefined;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  hooks: {
    ready: (nuxt) => {
      if (
        ['development-docker', 'production-docker'].includes(
          process.env.STAGE || ''
        )
      )
        setDockerSecrets();
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  nitro: {
    externals: {
      inline: ['uuid'],
    },
  },
  runtimeConfig: {
    mySqlURL: process.env.MYSQL_URL,
    hasherRounds: process.env.HASHER_ROUNDS,
    jwt: {
      key: process.env.JWT_KEY,
      expiration: {
        number: process.env.JWT_EXPIRATION_NUMBER,
        period: process.env.JWT_EXPIRATION_PERIOD,
      },
    },
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
