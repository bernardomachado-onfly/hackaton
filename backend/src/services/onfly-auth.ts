const OAUTH_URL = 'https://api.onfly.com.br/oauth/token';
const INTERNAL_TOKEN_URL = 'https://api.onfly.com/auth/token/internal';

const CLIENT_ID = parseInt(process.env.ONFLY_CLIENT_ID || '1265', 10);
const CLIENT_SECRET = process.env.ONFLY_CLIENT_SECRET || 'yIUFVTrf2vdzmYVKiBRj5TLMl3XGBT1D7H15pEQ2';

interface TokenCache {
  oauthToken: string;
  oauthExpiresAt: number;
  internalToken: string;
  internalExpiresAt: number;
}

let cache: TokenCache | null = null;

// Step 1: Get OAuth token (lasts ~1 year)
async function getOAuthToken(forceNew = false): Promise<string> {
  if (!forceNew && cache?.oauthToken && Date.now() < cache.oauthExpiresAt) {
    return cache.oauthToken;
  }

  console.log('🔑 [Auth] Obtendo OAuth token...');

  const response = await fetch(OAUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      scope: '*',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => '');
    throw new Error(`OAuth failed: ${response.status} ${err.substring(0, 200)}`);
  }

  const data = await response.json() as { access_token: string; expires_in: number };
  const token = data.access_token;
  const expiresAt = Date.now() + (data.expires_in * 1000) - 60000;

  if (!cache) {
    cache = { oauthToken: '', oauthExpiresAt: 0, internalToken: '', internalExpiresAt: 0 };
  }
  cache.oauthToken = token;
  cache.oauthExpiresAt = expiresAt;

  console.log('✅ [Auth] OAuth token obtido (expira em', Math.round(data.expires_in / 3600), 'horas)');
  return token;
}

// Step 2: Exchange OAuth token for internal session token
async function getInternalToken(forceNewOAuth = false): Promise<string> {
  if (!forceNewOAuth && cache?.internalToken && Date.now() < cache.internalExpiresAt) {
    return cache.internalToken;
  }

  const oauthToken = await getOAuthToken(forceNewOAuth);

  console.log('🔑 [Auth] Obtendo token interno...');

  const response = await fetch(INTERNAL_TOKEN_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${oauthToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.text().catch(() => '');
    // If internal token fails and we didn't force new OAuth, retry with fresh OAuth
    if (!forceNewOAuth) {
      console.log('⚠️ [Auth] Token interno falhou, tentando com OAuth novo...');
      return getInternalToken(true);
    }
    throw new Error(`Internal token failed: ${response.status} ${err.substring(0, 200)}`);
  }

  const data = await response.json() as { token?: string; refreshToken?: string };
  const token = data.token || '';

  if (!token) {
    throw new Error('Internal token: no token in response');
  }

  // Internal token lasts ~15 min, refresh at 12 min
  const expiresAt = Date.now() + (12 * 60 * 1000);

  if (!cache) {
    cache = { oauthToken: '', oauthExpiresAt: 0, internalToken: '', internalExpiresAt: 0 };
  }
  cache.internalToken = token;
  cache.internalExpiresAt = expiresAt;

  console.log('✅ [Auth] Token interno obtido');
  return token;
}

// Public API: get a valid token for Onfly BFF calls
export async function getOnflyToken(): Promise<string> {
  try {
    return await getInternalToken();
  } catch (err) {
    console.log('❌ [Auth] Falha total na autenticação:', (err as Error).message);
    // Nuclear reset — limpa tudo e tenta do zero
    cache = null;
    return await getInternalToken(true);
  }
}

// Force refresh (e.g., after a 401 from BFF)
export async function refreshOnflyToken(): Promise<string> {
  console.log('🔄 [Auth] Forçando renovação completa...');
  // Limpa tudo — novo OAuth + novo internal
  cache = null;
  return getInternalToken(true);
}
