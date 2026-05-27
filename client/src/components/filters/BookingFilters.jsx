import { FiFilter, FiSearch } from 'react-icons/fi';

export function BookingFilters({ filters, setFilters, showCandidate }) {
  return (
    <div className="filter-bar">
      <FiFilter />
      <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
        <option value="">All bookings</option>
        <option value="booked">Booked</option>
        <option value="cancelled">Cancelled</option>
        <option value="rescheduled">Rescheduled</option>
        <option value="completed">Completed</option>
      </select>
      <input type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} />
      {showCandidate && (
        <label className="search-input">
          <FiSearch />
          <input
            placeholder="Candidate name"
            value={filters.candidateName}
            onChange={(event) => setFilters({ ...filters, candidateName: event.target.value })}
          />
        </label>
      )}
    </div>
  );
}
