import React, { useState } from 'react';

const PlayerTracker = () => {
  const [riotId, setRiotId] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fixed: Removed trailing spaces in URL
  const API_BASE_URL = 'https://f793pbt9w8.execute-api.us-east-1.amazonaws.com/Prod';

  const searchPlayer = async () => {
    if (!riotId.trim()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Searching for player:', riotId);

      const response = await fetch(`${API_BASE_URL}/player/${encodeURIComponent(riotId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Search response status:', response.status);

      const data = await response.json();
      console.log('Search response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setPlayerData(data);
    } catch (err) {
      console.error('Error searching player:', err);
      setError(err.message || 'Failed to search player data');
    } finally {
      setLoading(false);
    }
  };

  const updatePlayerData = async () => {
    if (!riotId.trim()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Updating player data:', riotId);

      const response = await fetch(`${API_BASE_URL}/player/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ✅ Fixed: Send `riotId` not `playerName`
        body: JSON.stringify({ riotId }),
      });

      console.log('Update response status:', response.status);

      const data = await response.json();
      console.log('Update response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setPlayerData(data);
    } catch (err) {
      console.error('Error updating player data:', err);
      setError(err.message || 'Failed to update player data');
    } finally {
      setLoading(false);
    }
  };

  const formatRank = (rankedStats) => {
    if (!rankedStats || rankedStats.length === 0) {
      return 'Unranked';
    }

    const soloQueue = rankedStats.find(r => r.queueType === 'RANKED_SOLO_5x5');
    if (soloQueue) {
      return `${soloQueue.tier} ${soloQueue.rank} (${soloQueue.leaguePoints} LP)`;
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
            onChange={(e) => setRiotId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && searchPlayer()}
            style={{
              flex: 1,
              minWidth: '300px',
              maxWidth: '400px',
              padding: '14px 18px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
          />

          <button
            onClick={searchPlayer}
            disabled={loading || !riotId.trim()}
            style={{
              padding: '14px 28px',
              background: loading || !riotId.trim()
                ? 'rgba(102, 126, 234, 0.5)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading || !riotId.trim() ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: loading || !riotId.trim() ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            {loading ? 'SEARCHING...' : 'SEARCH'}
          </button>

          <button
            onClick={updatePlayerData}
            disabled={loading || !riotId.trim()}
            style={{
              padding: '14px 28px',
              background: loading || !riotId.trim()
                ? 'rgba(231, 168, 8, 0.5)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading || !riotId.trim() ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: loading || !riotId.trim() ? 'none' : '0 4px 15px rgba(245, 87, 108, 0.4)'
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
                  <p><strong>Summoner Level:</strong> {playerData.summonerLevel}</p>
                  <p><strong>Last Updated:</strong> {new Date(playerData.lastUpdated * 1000).toLocaleString()}</p>
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
                  Ranked Statistics
                </h3>
                <div style={{ color: '#e2e8f0', lineHeight: '1.8' }}>
                  <p><strong>Rank:</strong> {formatRank(playerData.rankedStats)}</p>
                  <p><strong>Win Rate:</strong> {formatWinRate(playerData.rankedStats)}</p>
                </div>
              </div>
            </div>

            {/* Recent Matches Placeholder */}
            <div style={{ marginTop: '2rem', color: '#94a3b8', textAlign: 'center' }}>
              <em>Match history coming soon!</em>
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
            <li><strong>Search:</strong> Looks for existing data in the database</li>
            <li><strong>Update from API:</strong> Fetches fresh data from Riot Games API</li>
            <li>Use format: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>GameName#TagLine</code></li>
            <li>Example: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>Faker#KR1</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PlayerTracker;