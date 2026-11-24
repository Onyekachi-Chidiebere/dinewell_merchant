const {validateStagingUrl} = require('../staging-smoke');

describe('validateStagingUrl', () => {
  it('requires a target', () => {
    expect(() => validateStagingUrl()).toThrow('STAGING_API_URL is required');
  });

  it('requires HTTPS', () => {
    expect(() => validateStagingUrl('http://staging.example.com')).toThrow(
      'must use HTTPS',
    );
  });

  it('rejects the production API', () => {
    expect(() => validateStagingUrl('https://api.dinewell.ca')).toThrow(
      'must not target production',
    );
  });

  it('accepts and normalizes a staging API URL', () => {
    expect(validateStagingUrl('https://staging-api.dinewell.ca/')).toBe(
      'https://staging-api.dinewell.ca',
    );
  });
});
