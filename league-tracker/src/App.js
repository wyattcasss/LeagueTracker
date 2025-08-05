import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Champions');

  return (
    <div className="app-container">
      <header>
        <div>
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
        </div>
      </header>

      <main>
        {}
      </main>
    </div>
  );
}

export default App;