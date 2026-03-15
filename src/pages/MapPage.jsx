import { useMemo, useState, useEffect } from 'react';
import { useEmployeeData } from '../hooks/useEmployeeData';
import { CITY_COORDINATES } from '../utils/cityCoordinates';

export default function MapPage() {
  const { employees, loading, error } = useEmployeeData();
  const [size, setSize] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setSize(window.innerWidth);
    window.addEventListener('resize', onResize);
  }, []);

  const byCity = useMemo(() => {
    const counts = new Map();
    employees.forEach((employee) => {
      const city = employee.city;
      if (!CITY_COORDINATES[city]) return;
      counts.set(city, (counts.get(city) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([city, count]) => ({
      city,
      count,
      ...CITY_COORDINATES[city],
    }));
  }, [employees]);

  return (
    <section className="card">
      <h1>Employee City Distribution Map</h1>
      <p className="small-muted">Viewport width: {size}px</p>
      {loading && <p>Loading map points...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <svg className="map-svg" viewBox="350 120 400 450">
          <path
            d="M395 132 L430 140 L455 160 L500 170 L565 175 L620 190 L668 220 L695 250 L715 292 L703 330 L685 350 L686 390 L645 430 L628 469 L610 510 L560 538 L530 536 L505 510 L470 510 L430 492 L395 470 L375 430 L370 390 L380 350 L365 305 L374 258 L392 220 Z"
            fill="#eff6ff"
            stroke="#93c5fd"
            strokeWidth="4"
          />
          {byCity.map((point) => (
            <g key={point.city}>
              <circle cx={point.x} cy={point.y} fill="#ef4444" r={4 + point.count / 3} />
              <text className="svg-label" x={point.x + 8} y={point.y - 4}>
                {point.city} ({point.count})
              </text>
            </g>
          ))}
        </svg>
      )}
    </section>
  );
}
