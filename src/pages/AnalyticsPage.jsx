import { useMemo } from 'react';
import { useEmployeeData } from '../hooks/useEmployeeData';

export default function AnalyticsPage() {
  const { employees, loading, error } = useEmployeeData();

  const citySalary = useMemo(() => {
    const aggregate = new Map();

    employees.forEach((employee) => {
      const previous = aggregate.get(employee.city) || 0;
      aggregate.set(employee.city, previous + employee.salary);
    });

    return Array.from(aggregate.entries())
      .map(([city, totalSalary]) => ({ city, totalSalary }))
      .sort((a, b) => b.totalSalary - a.totalSalary)
      .slice(0, 8);
  }, [employees]);

  const max = citySalary[0]?.totalSalary || 1;

  return (
    <section className="card">
      <h1>Salary Distribution by City</h1>
      {loading && <p>Loading analytics...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <svg className="bar-chart" height="340" viewBox="0 0 900 340" width="900">
          {citySalary.map((entry, index) => {
            const x = 40 + index * 100;
            const barHeight = (entry.totalSalary / max) * 220;
            const y = 260 - barHeight;

            return (
              <g key={entry.city}>
                <rect fill="#3b82f6" height={barHeight} rx="6" width="56" x={x} y={y} />
                <text className="svg-label" x={x + 28} y="282">
                  {entry.city}
                </text>
                <text className="svg-value" x={x + 28} y={y - 8}>
                  {(entry.totalSalary / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </section>
  );
}
