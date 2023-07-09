const periodToSecondsMultiplierMapper: { [key: string]: number } = {
  seconds: 1,
  minutes: 60,
  hours: 60 * 60,
  days: 60 * 60 * 24,
  years: 60 * 60 * 24 * 365,
};

const isEnvSet =
  !!process.env.JWT_EXPIRATION_NUMBER && !!process.env.JWT_EXPIRATION_PERIOD;

export const MILLIS_EXPIRES_IN =
  !isEnvSet ||
  !periodToSecondsMultiplierMapper[process.env.JWT_EXPIRATION_PERIOD!]
    ? 60 * 60
    : periodToSecondsMultiplierMapper[process.env.JWT_EXPIRATION_PERIOD!] *
      +process.env.JWT_EXPIRATION_NUMBER! * 1000;
