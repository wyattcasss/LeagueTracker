import React, { useState } from 'react';
import './App.css';
import championData from './data/champions.json';
// Sample data for demonstration
import ChampionCard from './components/champCard.js'



function App() {
  const [currentPage, setCurrentPage] = useState('Champions');

  return (
    <div className="app-container">
      <header>
        <nav>
          <button
            onClick={() => setCurrentPage('Champions')}
            className={currentPage === 'Champions' ? 'active' : ''}
          >
            Champions
          </button>
          <button
            onClick={() => setCurrentPage('Tracker')}
            className={currentPage === 'Tracker' ? 'active' : ''}
          >
            Tracker
          </button>
        </nav>
      </header>

      <main>
        {currentPage === 'Champions' && (
          <div className="champions-grid">
            {championData.map(champion => (
              <ChampionCard key={champion.id} {...champion} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;