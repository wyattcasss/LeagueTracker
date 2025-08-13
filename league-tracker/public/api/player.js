// api/player.js - Vercel serverless function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const API_KEY = process.env.RIOT_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    if (req.method === 'GET') {
      // Get player by Riot ID from query params
      const { riotId } = req.query;
      
      if (!riotId || !riotId.includes('#')) {
        return res.status(400).json({ error: 'Invalid Riot ID format' });
      }

      const [gameName, tagLine] = riotId.split('#');

      // 1. Get account info
      const accountResponse = await fetch(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?api_key=${API_KEY}`
      );

      if (!accountResponse.ok) {
        if (accountResponse.status === 404) {
          return res.status(404).json({ error: 'Player not found' });
        }
        throw new Error(`Account API error: ${accountResponse.status}`);
      }

      const account = await accountResponse.json();

      // 2. Get summoner info
      const summonerResponse = await fetch(
        `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}?api_key=${API_KEY}`
      );

      if (!summonerResponse.ok) {
        throw new Error(`Summoner API error: ${summonerResponse.status}`);
      }

      const summoner = await summonerResponse.json();

      // 3. Get ranked stats
      const rankedResponse = await fetch(
        `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}?api_key=${API_KEY}`
      );

      const rankedStats = rankedResponse.ok ? await rankedResponse.json() : [];

      // Return combined data
      const playerData = {
        riotId: `${gameName}#${tagLine}`,
        name: summoner.name,
        summonerLevel: summoner.summonerLevel,
        rankedStats: rankedStats,
        lastUpdated: Math.floor(Date.now() / 1000)
      };

      return res.json(playerData);

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('API Error:', error);
    
    if (error.message.includes('429')) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    
    return res.status(500).json({ error: error.message });
  }
}