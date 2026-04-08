import type { ToolInput, ToolContext } from './index.js';
import { getOnflyToken, refreshOnflyToken } from '../services/onfly-auth.js';

const AIRPORTS_URL = 'https://toguro-app-prod.onfly.com/bff/destination/airports';

export async function searchDestinations(input: ToolInput, context: ToolContext = {}) {
  const query = input.query as string;

  const token = context.onflyToken || await getOnflyToken().catch(() => '');
  if (!token) {
    console.log('⚠️ [Destinations] Sem token, retornando vazio');
    return { success: false, error: 'Sem autenticação', results: [] };
  }

  console.log(`🔍 [Destinations] Buscando: "${query}"`);

  const response = await fetch(`${AIRPORTS_URL}?lang=pt-br&search=${encodeURIComponent(query)}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${token}`,
      'origin': 'https://app.onfly.com',
    },
  });

  if (response.status === 401) {
    console.log('🔄 [Destinations] Token expirado, renovando...');
    const newToken = await refreshOnflyToken();
    const retry = await fetch(`${AIRPORTS_URL}?lang=pt-br&search=${encodeURIComponent(query)}`, {
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${newToken}`,
        'origin': 'https://app.onfly.com',
      },
    });
    if (!retry.ok) {
      const err = await retry.text().catch(() => '');
      console.log(`❌ [Destinations] Erro após retry ${retry.status}: ${err.substring(0, 100)}`);
      return { success: false, error: `API error: ${retry.status}`, results: [] };
    }
    const retryData = await retry.json() as { data: any[] };
    const results = (retryData.data || []).map((item: any) => ({
      code: item.code, name: item.name, type: item.type,
      cityId: item.city?.id, cityName: item.city?.name,
      stateCode: item.city?.stateCode, countryCode: item.city?.countryCode,
      airports: (item.destinations || []).map((d: any) => ({ code: d.code, name: d.name, type: d.type })),
    }));
    console.log(`✅ [Destinations] ${results.length} resultados para "${query}" (após retry)`);
    return { success: true, query, results, total: results.length };
  }

  if (!response.ok) {
    const err = await response.text().catch(() => '');
    console.log(`❌ [Destinations] Erro ${response.status}: ${err.substring(0, 100)}`);
    return { success: false, error: `API error: ${response.status}`, results: [] };
  }

  const data = await response.json() as { data: any[] };
  const results = (data.data || []).map((item: any) => ({
    code: item.code,
    name: item.name,
    type: item.type,
    cityId: item.city?.id,
    cityName: item.city?.name,
    stateCode: item.city?.stateCode,
    countryCode: item.city?.countryCode,
    airports: (item.destinations || []).map((d: any) => ({
      code: d.code,
      name: d.name,
      type: d.type,
    })),
  }));

  console.log(`✅ [Destinations] ${results.length} resultados para "${query}"`);

  return {
    success: true,
    query,
    results,
    total: results.length,
  };
}
