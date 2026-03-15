import { useMemo, useState } from 'react';
import VirtualizedEmployeeTable from '../components/VirtualizedEmployeeTable';
import { useEmployeeData } from '../hooks/useEmployeeData';

export default function EmployeeListPage() {
  const { employees, loading, error, refetch } = useEmployeeData();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return employees;

    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(normalized) ||
        employee.email.toLowerCase().includes(normalized) ||
        employee.city.toLowerCase().includes(normalized),
    );
  }, [employees, query]);

  return (
    <section className="card">
      <div className="row-between">
        <h1>Employee Directory</h1>
        <button onClick={refetch} type="button">
          Refresh
        </button>
      </div>
      <input
        className="search"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email, city"
        value={query}
      />

      {loading && <p>Loading employees...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <VirtualizedEmployeeTable rows={filtered} />}
    </section>
  );
}
