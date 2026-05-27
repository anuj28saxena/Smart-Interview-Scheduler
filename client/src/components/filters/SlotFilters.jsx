import { FiFilter } from 'react-icons/fi';

export function SlotFilters({ filters, setFilters }) {
  return (
    <div className="filter-bar">
      <FiFilter />
      <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
        <option value="">All statuses</option>
        <option value="available">Available</option>
        <option value="booked">Booked</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} />
    </div>
  );
}
