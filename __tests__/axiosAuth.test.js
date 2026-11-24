jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })),
    post: jest.fn(),
  },
}));

jest.mock('../src/services/tokenStorage', () => ({
  getAuthTokens: jest.fn(() =>
    Promise.resolve({ accessToken: 'old', refreshToken: 'refresh' }),
  ),
  setAuthTokens: jest.fn(() => Promise.resolve()),
  clearAuthTokens: jest.fn(() => Promise.resolve()),
}));

import axios from 'axios';
import { refreshSession } from '../src/api/axios';
import { setAuthTokens } from '../src/services/tokenStorage';

test('startup refresh stores the rotated merchant token pair', async () => {
  axios.post.mockResolvedValue({
    data: { accessToken: 'new', refreshToken: 'rotated' },
  });

  await expect(refreshSession()).resolves.toBe('new');
  expect(axios.post).toHaveBeenCalledWith(
    expect.stringContaining('/auth/refresh'),
    { refreshToken: 'refresh' },
    expect.objectContaining({ timeout: 20000 }),
  );
  expect(setAuthTokens).toHaveBeenCalledWith({
    accessToken: 'new',
    refreshToken: 'rotated',
  });
});
