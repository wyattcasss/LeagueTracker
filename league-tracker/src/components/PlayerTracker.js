import React, { useState } from 'react';

const PlayerTracker = () => {
  const [riotId, setRiotId] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // For local development with Vercel functions: http://localhost:3000/api
  // For production on Vercel: /api (relative URL)
  const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api';

  const searchPlayer = async () => {
    if (!riotId.trim()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Fetching player data:', riotId);

      const response = await fetch(`${API_BASE_URL}/player?riotId=${encodeURIComponent(riotId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setPlayerData(data);
    } catch (err) {
      console.error('Error fetching player:', err);
      setError(err.message || 'Failed to fetch player data');
    } finally {
      setLoading(false);
    }
  };

  // Since we're calling the API directly each time, both buttons do the same thing
  const updatePlayerData = searchPlayer;

  const formatRank = (rankedStats) => {
    if (!rankedStats || rankedStats.length === 0) {
      return 'Unranked';
    }

    const soloQueue = rankedStats.find(r => r.queueType === 'RANKED_SOLO_5x5');
    if (soloQueue) {
      const tier = soloQueue.tier?.charAt(0) + soloQueue.tier?.slice(1).toLowerCase();
      return `${tier} ${soloQueue.rank} (${soloQueue.leaguePoints} LP)`;
    }

    return 'Unranked';
  };

  const formatWinRate = (rankedStats) => {
    if (!rankedStats || rankedStats.length === 0) {
      return 'N/A';
    }

    const soloQueue = rankedStats.find(r => r.queueType === 'RANKED_SOLO_5x5');
    if (soloQueue) {
      const total = soloQueue.wins + soloQueue.losses;
      const winRate = total > 0 ? ((soloQueue.wins / total) * 100).toFixed(1) : '0.0';
      return `${winRate}% (${soloQueue.wins}W ${soloQueue.losses}L)`;
    }

    return 'N/A';
  };

  const validateRiotId = (input) => {
    const pattern = /^.+#.+$/;
    return pattern.test(input.trim());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setRiotId(value);
    if (value && !validateRiotId(value)) {
      setError('Please use format: GameName#TagLine (e.g., Faker#KR1)');
    } else {
      setError('');
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      color: 'white',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'rgba(28, 28, 30, 0.9)',
        borderRadius: '16px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '2.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: '700'
        }}>
          League of Legends Player Tracker
        </h1>

        <p style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '1.1rem'
        }}>
          Search for League of Legends players using their Riot ID
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <input
            type="text"
            placeholder="Enter Riot ID (e.g., Faker#KR1)"
            value={riotId}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && !loading && validateRiotId(riotId) && searchPlayer()}
            style={{
              flex: 1,
              minWidth: '300px',
              maxWidth: '400px',
              padding: '14px 18px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: `2px solid ${!validateRiotId(riotId) && riotId ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
          />

          <button
            onClick={searchPlayer}
            disabled={loading || !riotId.trim() || !validateRiotId(riotId)}
            style={{
              padding: '14px 28px',
              background: loading || !riotId.trim() || !validateRiotId(riotId)
                ? 'rgba(102, 126, 234, 0.5)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading || !riotId.trim() || !validateRiotId(riotId) ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: loading || !riotId.trim() || !validateRiotId(riotId) ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            {loading ? 'SEARCHING...' : 'SEARCH'}
          </button>

          <button
            onClick={updatePlayerData}
            disabled={loading || !riotId.trim() || !validateRiotId(riotId)}
            style={{
              padding: '14px 28px',
              background: loading || !riotId.trim() || !validateRiotId(riotId)
                ? 'rgba(231, 168, 8, 0.5)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading || !riotId.trim() || !validateRiotId(riotId) ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: loading || !riotId.trim() || !validateRiotId(riotId) ? 'none' : '0 4px 15px rgba(245, 87, 108, 0.4)'
            }}
          >
            {loading ? 'UPDATING...' : 'UPDATE FROM API'}
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '2rem',
            textAlign: 'center',
            fontSize: '16px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {playerData && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Player Info */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#667eea', fontSize: '1.3rem', fontWeight: '600' }}>
                  Player Information
                </h3>
                <div style={{ color: '#e2e8f0', lineHeight: '1.8' }}>
                  <p><strong>Riot ID:</strong> {playerData.riotId}</p>
                  <p><strong>Summoner Name:</strong> {playerData.name || 'N/A'}</p>
                  <p><strong>Summoner Level:</strong> {playerData.summonerLevel}</p>
                  <p><strong>Server:</strong> {playerData.region || 'N/A'}</p>
                  <p><strong>Last Updated:</strong> {
                    playerData.lastUpdated 
                      ? new Date(typeof playerData.lastUpdated === 'number' ? playerData.lastUpdated * 1000 : playerData.lastUpdated).toLocaleString()
                      : 'N/A'
                  }</p>
                </div>
              </div>

              {/* Ranked Stats */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#f093fb', fontSize: '1.3rem', fontWeight: '600' }}>
                  Ranked Statistics (Solo/Duo)
                </h3>
                <div style={{ color: '#e2e8f0', lineHeight: '1.8' }}>
                  <p><strong>Current Rank:</strong> {formatRank(playerData.rankedStats)}</p>
                  <p><strong>Win Rate:</strong> {formatWinRate(playerData.rankedStats)}</p>
                </div>
              </div>
            </div>

            {/* Additional Stats if available */}
            {playerData.rankedStats && playerData.rankedStats.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginTop: '1rem'
              }}>
                <h4 style={{ marginBottom: '1rem', color: '#a78bfa' }}>All Ranked Queues</h4>
                {playerData.rankedStats.map((queue, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    color: '#e2e8f0'
                  }}>
                    <p><strong>{queue.queueType?.replace('RANKED_', '').replace('_', ' ')}:</strong> {queue.tier} {queue.rank} ({queue.leaguePoints} LP)</p>
                    <p>W/L: {queue.wins}W {queue.losses}L ({queue.wins + queue.losses > 0 ? ((queue.wins / (queue.wins + queue.losses)) * 100).toFixed(1) : 0}%)</p>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Matches Placeholder */}
            <div style={{ marginTop: '2rem', color: '#94a3b8', textAlign: 'center' }}>
              <em>Match history feature coming soon!</em>
            </div>
          </div>
        )}

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          color: '#93c5fd'
        }}>
          <h4 style={{ marginBottom: '1rem', color: '#60a5fa' }}>How to use:</h4>
          <ol style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            <li><strong>Search:</strong> Looks for existing data in your database</li>
            <li><strong>Update from API:</strong> Fetches fresh data from Riot Games API</li>
            <li>Use format: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>GameName#TagLine</code></li>
            <li>Examples: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>Faker#KR1</code>, <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>Doublelift#NA1</code></li>
            <li><strong>Note:</strong> API has rate limits, use "Search" first to check cached data</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PlayerTracker;