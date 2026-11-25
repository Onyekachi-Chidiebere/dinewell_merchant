import * as Keychain from 'react-native-keychain';

const AUTH_SERVICE = 'ca.dinewell.merchant.auth';
const SIGNUP_SERVICE = 'ca.dinewell.merchant.signup';

/** Same-process cache so signup steps right after details always have x-signup-token
 *  even if Keychain read is briefly unavailable on some devices. */
let memoryAuthTokens = null;
let memorySignupToken = null;

const write = (service, value) =>
  Keychain.setGenericPassword('token', JSON.stringify(value), {
    service,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });

const read = async (service) => {
  const credentials = await Keychain.getGenericPassword({ service });
  if (!credentials || typeof credentials === 'boolean') {
    return null;
  }
  try {
    return JSON.parse(credentials.password);
  } catch {
    await Keychain.resetGenericPassword({ service });
    return null;
  }
};

export const getAuthTokens = async () => {
  if (
    memoryAuthTokens?.accessToken &&
    memoryAuthTokens?.refreshToken
  ) {
    return memoryAuthTokens;
  }
  const stored = await read(AUTH_SERVICE);
  if (stored?.accessToken && stored?.refreshToken) {
    memoryAuthTokens = {
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
    };
    return memoryAuthTokens;
  }
  return null;
};

export const setAuthTokens = async (tokens) => {
  const next = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
  memoryAuthTokens = next;
  await write(AUTH_SERVICE, next);
};

export const clearAuthTokens = async () => {
  memoryAuthTokens = null;
  await Keychain.resetGenericPassword({ service: AUTH_SERVICE });
};

export const getSignupToken = async () => {
  if (typeof memorySignupToken === 'string' && memorySignupToken.length > 0) {
    return memorySignupToken;
  }
  const stored = await read(SIGNUP_SERVICE);
  const token = stored?.signupToken || null;
  if (typeof token === 'string' && token.length > 0) {
    memorySignupToken = token;
    return token;
  }
  return null;
};

export const setSignupToken = async (signupToken) => {
  if (!signupToken || typeof signupToken !== 'string') {
    throw new Error('Signup response did not include a signup token');
  }
  memorySignupToken = signupToken;
  await write(SIGNUP_SERVICE, { signupToken });
};

export const clearSignupToken = async () => {
  memorySignupToken = null;
  await Keychain.resetGenericPassword({ service: SIGNUP_SERVICE });
};
