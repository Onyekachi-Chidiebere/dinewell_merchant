import * as Keychain from 'react-native-keychain';

const AUTH_SERVICE = 'ca.dinewell.merchant.auth';
const SIGNUP_SERVICE = 'ca.dinewell.merchant.signup';

const write = (service, value) =>
  Keychain.setGenericPassword('token', JSON.stringify(value), {
    service,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });

const read = async (service) => {
  const credentials = await Keychain.getGenericPassword({ service });
  if (!credentials) {return null;}
  try {
    return JSON.parse(credentials.password);
  } catch {
    await Keychain.resetGenericPassword({ service });
    return null;
  }
};

export const getAuthTokens = () => read(AUTH_SERVICE);
export const setAuthTokens = (tokens) =>
  write(AUTH_SERVICE, {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
export const clearAuthTokens = () =>
  Keychain.resetGenericPassword({ service: AUTH_SERVICE });

export const getSignupToken = async () => (await read(SIGNUP_SERVICE))?.signupToken || null;
export const setSignupToken = (signupToken) =>
  write(SIGNUP_SERVICE, { signupToken });
export const clearSignupToken = () =>
  Keychain.resetGenericPassword({ service: SIGNUP_SERVICE });
