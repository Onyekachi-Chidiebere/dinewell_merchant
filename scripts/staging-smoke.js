const REQUEST_TIMEOUT_MS = 10_000;
const PRODUCTION_HOST = 'api.dinewell.ca';

function validateStagingUrl(value) {
  if (!value) {
    throw new Error('STAGING_API_URL is required');
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('STAGING_API_URL must be a valid URL');
  }

  if (url.protocol !== 'https:') {
    throw new Error('STAGING_API_URL must use HTTPS');
  }
  if (url.hostname === PRODUCTION_HOST) {
    throw new Error(`STAGING_API_URL must not target production (${PRODUCTION_HOST})`);
  }
  if (url.username || url.password) {
    throw new Error('STAGING_API_URL must not contain credentials');
  }

  return url.href.replace(/\/$/, '');
}

async function checkEndpoint(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`, {
    signal: global.AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {accept: 'application/json'},
  });
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  console.log(`${path}: HTTP ${response.status}`);
}

async function main() {
  const baseUrl = validateStagingUrl(process.env.STAGING_API_URL);
  await checkEndpoint(baseUrl, '/health');
  await checkEndpoint(baseUrl, '/ready');
}

if (require.main === module) {
  main().catch(error => {
    console.error(`Staging smoke test failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {validateStagingUrl};
