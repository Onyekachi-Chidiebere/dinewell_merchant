const mockValues = new Map<string, string>();

jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'device-only' },
  setGenericPassword: jest.fn(async (_user, password, options) => {
    mockValues.set(options.service, password);
    return true;
  }),
  getGenericPassword: jest.fn(async ({ service }) => {
    const password = mockValues.get(service);
    return password ? { username: 'token', password } : false;
  }),
  resetGenericPassword: jest.fn(async ({ service }) => mockValues.delete(service)),
}));

import {
  clearAuthTokens,
  clearSignupToken,
  getAuthTokens,
  getSignupToken,
  setAuthTokens,
  setSignupToken,
} from '../src/services/tokenStorage';

beforeEach(() => mockValues.clear());

test('stores and clears session tokens together', async () => {
  await setAuthTokens({ accessToken: 'access', refreshToken: 'refresh' });
  await expect(getAuthTokens()).resolves.toEqual({
    accessToken: 'access',
    refreshToken: 'refresh',
  });
  await clearAuthTokens();
  await expect(getAuthTokens()).resolves.toBeNull();
});

test('keeps the temporary signup token separate', async () => {
  await setSignupToken('signup-1');
  await setAuthTokens({ accessToken: 'access', refreshToken: 'refresh' });
  await expect(getSignupToken()).resolves.toBe('signup-1');
  await clearSignupToken();
  await expect(getSignupToken()).resolves.toBeNull();
  await expect(getAuthTokens()).resolves.toBeTruthy();
});
