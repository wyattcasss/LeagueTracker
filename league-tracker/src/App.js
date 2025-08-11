import React, { useState, useMemo } from 'react';
import './App.css';
import championData from './data/champions.json';
import ChampionCard from './components/champCard.js';
import SearchSidebar from './components/SearchSidebar.js';

function App() {
  const [currentPage, setCurrentPage] = useState('Champions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter and sort champions
  const filteredAndSortedChampions = useMemo(() => {
    let filtered = championData;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(champion =>
        champion.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRole !== 'All') {
      filtered = filtered.filter(champion => champion.category === selectedRole);
    }

    // Sort champions
    if (sortBy === 'A-Z') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'Z-A') {
      filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  }, [searchQuery, selectedRole, sortBy]);

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

      <div className="main-content">
        {currentPage === 'Champions' && (
          <>
            <SearchSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              sortBy={sortBy}
              setSortBy={setSortBy}
              isOpen={sidebarOpen}
              setIsOpen={setSidebarOpen}
            />
            
            <main className="champions-main">
              <div className="champions-header">
                <h2>Champions ({filteredAndSortedChampions.length})</h2>
                {searchQuery && (
                  <p className="search-info">
                    Showing results for "{searchQuery}"
                  </p>
                )}
              </div>
              
              <div className="champions-grid">
                {filteredAndSortedChampions.map(champion => (
                  <ChampionCard key={champion.id} {...champion} />
                ))}
              </div>
              
              {filteredAndSortedChampions.length === 0 && (
                <div className="no-results">
                  <p>No champions found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRole('All');
                      setSortBy('Default');
                    }}
                    className="reset-filters"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </main>
          </>
        )}

        {currentPage === 'Tracker' && (
          <main>
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'white' }}>
              <h2>Tracker Page</h2>
              <p>Tracker functionality coming soon...</p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;