import React from 'react';

const TYPE_FILTERS = ['Toutes', 'Feature', 'Bug', 'Tech'];

function FilterBar({ search, onSearch, activeFilter, onFilter, sortConfig, onSortChange }) {
    
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig?.key === key && sortConfig.direction === 'desc') {
            direction = null;
        }
        
        if (direction === null) {
            onSortChange(null);
        } else {
            onSortChange({ key, direction });
        }
    };

    const getSortIcon = (key) => {
        if (sortConfig?.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="filter-bar">

            <input
                className="search-local"
                placeholder="Rechercher dans le backlog..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
            />

            {TYPE_FILTERS.map((f) => (
                <span
                    key={f}
                    className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
                    onClick={() => onFilter(f)}
                >
          {f}
        </span>
            ))}

            {/* Boutons de tri */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <span 
                    className={`filter-chip ${sortConfig?.key === 'priority' ? 'active' : ''}`}
                    onClick={() => handleSort('priority')}
                >
                    Priorité {getSortIcon('priority')}
                </span>
                <span 
                    className={`filter-chip ${sortConfig?.key === 'points' ? 'active' : ''}`}
                    onClick={() => handleSort('points')}
                >
                    Points {getSortIcon('points')}
                </span>
            </div>

        </div>
    );
}

export default FilterBar;
