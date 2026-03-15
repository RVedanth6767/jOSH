import { useMemo } from 'react';
import { CITY_COORDS } from '../constants/cityCoords';
import { useData } from '../contexts/DataContext';

const AnalyticsPage = () => {
  const { employees } = useData();

  const cityBreakdown = useMemo(() => {
    const counts = employees.reduce((acc, employee) => {
      acc[employee.city] = (acc[employee.city] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [employees]);

  return (
    <section>
      <header className="section-head"><h2>Workforce Analytics</h2></header>
      <div className="analytics-layout">
        <article className="card map-card">
          <h3>Employees by City</h3>
          <div className="map-wrap">
            {cityBreakdown.map(([city, count]) => {
              const point = CITY_COORDS[city];
              if (!point) return null;
              return (
                <div key={city} className="map-point" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
                  <span>{count}</span>
                  <label>{city}</label>
                </div>
              );
            })}
          </div>
        </article>
        <article className="card city-list">
          <h3>Top Cities</h3>
          <ul>
            {cityBreakdown.map(([city, count]) => (
              <li key={city}><span>{city}</span><strong>{count}</strong></li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
};

export default AnalyticsPage;
