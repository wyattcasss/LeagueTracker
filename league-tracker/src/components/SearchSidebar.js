
const roles = ['All', 'ADC', 'Support', 'Jungle', 'Top', 'Mid'];
const sortOptions = ['Default', 'A-Z', 'Z-A'];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
    </svg>
  );
}

function SearchSidebar({ 
  searchQuery, 
  setSearchQuery, 
  selectedRole, 
  setSelectedRole, 
  sortBy, 
  setSortBy,
  isOpen,
  setIsOpen 
}) {
  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FilterIcon />
        Filters
      </button>

      {/* Sidebar */}
      <div className={`search-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Filters & Search</h3>
          <button 
            className="close-sidebar"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <label>Search Champions</label>
          <div className="search-input-container">
            <SearchIcon />
            <input
              type="text"
              placeholder="Type champion name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="filter-section">
          <label>Filter by Role</label>
          <div className="role-buttons">
            {roles.map(role => (
              <button
                key={role}
                className={`role-button ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="sort-section">
          <label>Sort by Name</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}

export default SearchSidebar;