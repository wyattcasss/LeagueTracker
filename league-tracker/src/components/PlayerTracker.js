import React, { useState } from 'react';
import './PlayerTracker.css';

const PlayerTracker = () => {
  const [summonerName, setSummonerName] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Replace this with your actual API Gateway URL after deployment
  const API_BASE_URL = 'https://f793pbt9w8.execute-api.us-east-1.amazonaws.com/prod';

  const searchPlayer = async () => {
    if (!summonerName.trim()) {
      setError('Please enter a summoner name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First try to get existing data
      const response = await fetch(`${API_BASE_URL}/player/${encodeURIComponent(summonerName)}`);
      
      if (response.ok) {
        const data = await response.json();
        setPlayerData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Player not found in database');
        setPlayerData(null);
      }
    } catch (err) {
      setError('Failed to fetch player data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updatePlayerData = async () => {
    if (!summonerName.trim()) {
      setError('Please enter a summoner name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summonerName: summonerName.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPlayerData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update player data');
      }
    } catch (err) {
      setError('Failed to update player data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankString = (rankedData) => {
    if (!rankedData || rankedData.length === 0) return 'Unranked';
    
    const soloQueue = rankedData.find(entry => entry.queueType === 'RANKED_SOLO_5x5');
    if (soloQueue) {
      return `${soloQueue.tier} ${soloQueue.rank} (${soloQueue.leaguePoints} LP)`;
    }
    return 'Unranked';
  };

  const formatKDA = (kills, deaths, assists) => {
    const kda = deaths === 0 ? (kills + assists) : ((kills + assists) / deaths).toFixed(2);
    return `${kills}/${deaths}/${assists} (${kda} KDA)`;
  };

  const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );

  return (
    <div className="player-tracker">
      <div className="champions-header">
        <h2>Player Tracker</h2>
        <p className="search-info">Search for League of Legends players and view their stats</p>
      </div>

      <div className="tracker-search-section">
        <div className="tracker-search-container">
          <div className="tracker-search-input-group">
            <div className="search-input-container">
              <SearchIcon />
              <input
                type="text"
                placeholder="Enter summoner name (e.g., Faker, Doublelift)..."
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchPlayer()}
                disabled={loading}
                className="tracker-search-input"
              />
            </div>
            <div className="tracker-button-group">
              <button onClick={searchPlayer} disabled={loading} className="search-btn">
                {loading ? 'Loading...' : 'Search'}
              </button>
              <button onClick={updatePlayerData} disabled={loading} className="update-btn">
                {loading ? 'Updating...' : 'Update from API'}
              </button>
            </div>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      {playerData && (
        <div className="player-data-container">
          <div className="player-overview-card">
            <div className="player-header">
              <div className="player-icon">
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/${playerData.profileIconId}.png`}
                  alt="Profile Icon"
                />
              </div>
              <div className="player-info">
                <h3 className="player-name">{playerData.summonerName}</h3>
                <p className="player-level">Level {playerData.summonerLevel}</p>
                <p className="player-rank">{getRankString(playerData.rankedStats)}</p>
                <p className="last-updated">
                  Last updated: {new Date(playerData.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            {playerData.rankedStats && playerData.rankedStats.length > 0 && (
              <div className="ranked-stats-card">
                <h4>Ranked Statistics</h4>
                <div className="rank-entries">
                  {playerData.rankedStats.map((rank, index) => (
                    <div key={index} className="rank-entry">
                      <div className="rank-header">
                        <h5>{rank.queueType === 'RANKED_SOLO_5x5' ? 'Solo/Duo' : 'Flex Queue'}</h5>
                        <span className="rank-tier">{rank.tier} {rank.rank}</span>
                      </div>
                      <div className="rank-stats">
                        <div className="stat-item">
                          <span className="stat-label">LP</span>
                          <span className="stat-value">{rank.leaguePoints}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Wins</span>
                          <span className="stat-value">{rank.wins}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Losses</span>
                          <span className="stat-value">{rank.losses}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Win Rate</span>
                          <span className="stat-value">
                            {Math.round((rank.wins / (rank.wins + rank.losses)) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {playerData.recentMatches && playerData.recentMatches.length > 0 && (
              <div className="recent-matches-card">
                <h4>Recent Matches</h4>
                <div className="matches-list">
                  {playerData.recentMatches.map((match, index) => (
                    <div key={index} className={`match-card ${match.win ? 'win' : 'loss'}`}>
                      <div className="match-result">
                        <div className={`result-indicator ${match.win ? 'win' : 'loss'}`}>
                          {match.win ? 'W' : 'L'}
                        </div>
                        <div className="match-info">
                          <div className="champion-name">{match.championName}</div>
                          <div className="game-mode">{match.gameMode}</div>
                        </div>
                      </div>
                      <div className="match-stats">
                        <div className="kda-stat">
                          <span className="kda-label">KDA</span>
                          <span className="kda-value">{formatKDA(match.kills, match.deaths, match.assists)}</span>
                        </div>
                        <div className="damage-stat">
                          <span className="damage-label">Damage</span>
                          <span className="damage-value">{match.totalDamageDealt?.toLocaleString()}</span>
                        </div>
                        <div className="gold-stat">
                          <span className="gold-label">Gold</span>
                          <span className="gold-value">{match.goldEarned?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="match-duration">
                        {Math.floor(match.gameDuration / 60)}m {match.gameDuration % 60}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerTracker;