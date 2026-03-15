import { useMemo, useRef, useState } from 'react';

const ROW_HEIGHT = 44;

const VirtualTable = ({ rows, columns, height = 460, onRowClick }) => {
  const viewportRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = rows.length * ROW_HEIGHT;
  const visibleCount = Math.ceil(height / ROW_HEIGHT) + 8;
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 4);
  const end = Math.min(rows.length, start + visibleCount);

  const visibleRows = useMemo(() => rows.slice(start, end), [rows, start, end]);

  return (
    <div className="table-shell">
      <div className="thead">
        {columns.map((col) => (
          <div className="th" key={col.key} style={{ width: col.width || 'auto' }}>
            {col.label}
          </div>
        ))}
      </div>
      <div
        className="viewport"
        style={{ height }}
        ref={viewportRef}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleRows.map((row, index) => {
            const rowIndex = start + index;
            return (
              <div
                role="button"
                tabIndex={0}
                key={row.id}
                className="tr"
                style={{ transform: `translateY(${rowIndex * ROW_HEIGHT}px)` }}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onRowClick?.(row);
                  }
                }}
              >
                {columns.map((col) => (
                  <div className="td" key={col.key} style={{ width: col.width || 'auto' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VirtualTable;
