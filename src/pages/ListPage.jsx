import { useCallback, useEffect, useMemo, useState } from 'react';
import VirtualTable from '../components/VirtualTable';
import Icon from '../components/Icon';
import { useData } from '../contexts/DataContext';

const COLUMNS = [
  { key: 'id', label: 'ID', width: 120 },
  { key: 'name', label: 'Name', width: 220 },
  { key: 'department', label: 'Department', width: 140 },
  { key: 'city', label: 'City', width: 130 },
  { key: 'status', label: 'Status', width: 110 },
  { key: 'performance', label: 'Performance', width: 120 }
];

const ListPage = ({ navigate }) => {
  const { employees } = useData();
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(employees);

  const syncRows = useCallback(() => {
    const normalized = query.toLowerCase();
    setRows(
      employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(normalized) ||
          employee.department.toLowerCase().includes(normalized) ||
          employee.city.toLowerCase().includes(normalized)
      )
    );
  }, [query]);

  useEffect(() => {
    syncRows();
  }, [syncRows]);

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((row) => row.status === 'Active').length,
    avgPerformance: Math.round(rows.reduce((acc, row) => acc + row.performance, 0) / Math.max(rows.length, 1))
  }), [rows]);

  return (
    <section>
      <header className="section-head">
        <h2>Employee Directory</h2>
        <div className="search-box">
          <Icon name="search" />
          <input
            value={query}
            placeholder="Search name, city, or department"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </header>
      <div className="kpi-grid">
        <article className="card"><h3>Total</h3><strong>{stats.total}</strong></article>
        <article className="card"><h3>Active</h3><strong>{stats.active}</strong></article>
        <article className="card"><h3>Avg Performance</h3><strong>{stats.avgPerformance}%</strong></article>
      </div>
      <VirtualTable rows={rows} columns={COLUMNS} onRowClick={(row) => navigate(`/details/${row.id}`)} />
    </section>
  );
};

export default ListPage;
