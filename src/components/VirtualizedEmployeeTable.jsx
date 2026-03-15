import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ROW_HEIGHT = 52;
const VIEWPORT_HEIGHT = 540;
const BUFFER = 6;

function VirtualizedEmployeeTable({ rows }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const onScroll = useCallback((event) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const { startIndex, endIndex, topSpacerHeight, bottomSpacerHeight, visibleRows } = useMemo(() => {
    const totalRows = rows.length;
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
    const visible = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);
    const end = Math.min(totalRows, start + visible + BUFFER * 2);

    return {
      startIndex: start,
      endIndex: end,
      topSpacerHeight: start * ROW_HEIGHT,
      bottomSpacerHeight: Math.max(0, (totalRows - end) * ROW_HEIGHT),
      visibleRows: rows.slice(start, end),
    };
  }, [rows, scrollTop]);

  return (
    <div>
      <div className="table-header-row">
        <span>Name</span>
        <span>Email</span>
        <span>City</span>
        <span>Department</span>
        <span>Salary</span>
      </div>
      <div className="table-viewport" ref={containerRef} onScroll={onScroll}>
        <div style={{ height: topSpacerHeight }} />
        {visibleRows.map((employee, idx) => (
          <Link
            className="table-row"
            key={`${employee.id}-${startIndex + idx}`}
            to={`/details/${employee.id}`}
          >
            <span>{employee.name}</span>
            <span>{employee.email}</span>
            <span>{employee.city}</span>
            <span>{employee.department}</span>
            <span>${employee.salary.toLocaleString()}</span>
          </Link>
        ))}
        <div style={{ height: bottomSpacerHeight }} />
      </div>
      <p className="small-muted">
        Rendering {visibleRows.length} of {rows.length} rows ({startIndex} to {Math.max(startIndex, endIndex - 1)}).
      </p>
    </div>
  );
}

export default memo(VirtualizedEmployeeTable);
