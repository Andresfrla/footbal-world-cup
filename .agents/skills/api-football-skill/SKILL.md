---
name: api-football-skill
description: Provides guidelines and examples for interacting with the API-Football v3 API to retrieve soccer data (leagues, fixtures, teams, statistics, odds, etc.). Use this skill when the user requests to integrate football data or when you need to construct API calls to API-Football.
---

# API-Football Skill

Guide for integrating and using the API-Football v3 API in applications.

**Documentation:** [https://www.api-football.com/documentation-v3](https://www.api-football.com/documentation-v3)
**Base URL:** `https://v3.football.api-sports.io/`

---

## 1. Authentication & Basics

The API-Football API requires an API key. 
All requests must be `GET` requests. If you use a non-GET method or extra unsupported headers, the API will return an error.

**Headers required:**
```json
{
  "x-apisports-key": "YOUR_API_KEY"
}
```

*Note:* In Node.js or browser environments, ensure no unnecessary headers (like complex CORS headers overriding defaults) are sent that are not supported by the API.

---

## 2. Common Endpoints

Here are the most common endpoints used in API-Football.

- **`/status`**: Validate your API key, check account details and quotas (this call does not count towards the daily limit).
- **`/timezone`**: Get the list of supported timezones.
- **`/countries`**: Get the list of available countries.
- **`/leagues`**: List all available leagues and cups (can be filtered by `id`, `name`, `country`, `season`, `type`, etc.).
- **`/teams`**: Get team information (filter by `id`, `name`, `league`, `season`, `country`).
- **`/players`**: Get player information/profiles.
- **`/fixtures`**: Get upcoming or past fixtures. Can filter by `date`, `league`, `season`, `team`, `live` (for live matches).
- **`/fixtures/statistics`**: Mid-game or post-game statistics for a fixture.
- **`/standings`**: Get league standings.
- **`/odds`**: Pre-match odds from various bookmakers.

---

## 3. Response Structure

All successful responses follow this JSON structure:

```json
{
    "get": "endpoint name",
    "parameters": {
        "param_name": "value"
    },
    "errors": [],
    "results": 1,
    "paging": {
        "current": 1,
        "total": 1
    },
    "response": [
        // Array of data objects
    ]
}
```

When implementing error handling, always check the `errors` array. If empty, the request was successful.

---

## 4. Rate Limiting and Performance

The API returns pagination and rate-limiting headers in the response:
- `x-ratelimit-requests-limit`: Requests allocated per day.
- `x-ratelimit-requests-remaining`: Remaining requests per day.
- `X-RateLimit-Limit`: Maximum requests per minute.
- `X-RateLimit-Remaining`: Remaining requests per minute.

**Important Considerations for the AI:**
1. **Caching:** Since football data (like past fixtures, team info, leagues, logos) doesn't change frequently, *always* advise the user to implement caching (Redis, DB, or file cache) to save daily quotas.
2. **Logos and Images:** The API returns URLs for team/league logos. Calling these images directly is free of quota. However, do not hotlink them heavily in production without a CDN, as they are rate-limited per second.

---

## 5. Code Implementation Examples

When asked to implement fetching logic, use one of the following patterns based on the user's framework.

### TypeScript / Fetch API (Next.js, React, Node 18+)

```typescript
export async function getFixtures(leagueId: number, season: number) {
  const apiKey = process.env.API_SPORTS_KEY;
  if (!apiKey) throw new Error("API_SPORTS_KEY is not defined");

  const url = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-apisports-key': apiKey
    },
    // In Next.js App Router, you might want to cache the response for a period
    next: { revalidate: 3600 } 
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors && data.errors.length > 0) {
     console.error("API Errors:", data.errors);
  }
  
  return data.response;
}
```

### Axios (Node.js)

```javascript
import axios from 'axios';

async function getTeamInfo(teamId) {
  try {
    const config = {
      method: 'get',
      url: `https://v3.football.api-sports.io/teams?id=${teamId}`,
      headers: {
        'x-apisports-key': process.env.API_SPORTS_KEY
      }
    };
    
    const response = await axios(config);
    return response.data.response;
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
}
```

---

## 6. Implementation Workflow

When asked to integrate API-Football:
1. Identify the framework the user is using (e.g., Next.js, Express).
2. Ask the user for the specific data they want to display (Fixtures, Teams, Standings, etc.) to figure out the correct endpoints.
3. Suggest an `.env` setup using `API_SPORTS_KEY`.
4. Provide the data-fetching utility using `fetch` or `axios`, including robust error handling taking into account the `errors` array inside the response body.
5. Create fully-typed interfaces for the requested endpoints if the user uses TypeScript.
6. Suggest a caching strategy (e.g., Redis, in-memory, ORM, or Next.js `revalidate`) to respect API rate limits.
