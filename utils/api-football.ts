const API_KEY = process.env.EXPO_PUBLIC_API_SPORTS_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

if (!API_KEY) {
  console.warn('¡Falta EXPO_PUBLIC_API_SPORTS_KEY en tu archivo .env!');
}

/**
 * Función genérica para hacer peticiones a la API-Football
 * @param endpoint El endpoint a consultar (ej: '/leagues', '/fixtures?date=2023-10-10')
 * @returns La respuesta parseada de la API
 */
export const fetchApiFootball = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'x-apisports-key': API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      // In API-Football v3, errors can be an array (rare) or an object (very common for auth/param errors)
      const hasErrors = Array.isArray(data.errors) 
        ? data.errors.length > 0 
        : Object.keys(data.errors).length > 0;

      if (hasErrors) {
        console.error('Errores desde la API:', data.errors);
        // Si hay error de token o similar, data.response será vacío.
        // No lanzamos excepcion para no crashear la app y dejar que la UI muestre vacío
        return []; 
      }
    }

    return data.response;
  } catch (error) {
    console.error(`Ocurrió un error al obtener datos de ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Ejemplo: Obtener todas las ligas
 */
export const getLeagues = async () => {
  return await fetchApiFootball('/leagues');
};

/**
 * Ejemplo: Obtener equipos de una liga en una temporada específica
 * @param leagueId ID de la liga (ej: 39 para Premier League)
 * @param season Año de la temporada (ej: 2023)
 */
export const getTeamsByLeague = async (leagueId: number, season: number) => {
  return await fetchApiFootball(`/teams?league=${leagueId}&season=${season}`);
};

/**
 * Obtener todos los partidos de una liga en una temporada 
 * (ej: Mundial, league=1)
 */
export const getFixtures = async (leagueId: number, season: number) => {
  return await fetchApiFootball(`/fixtures?league=${leagueId}&season=${season}`);
};
