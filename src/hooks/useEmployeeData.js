import { useCallback, useEffect, useMemo, useState } from 'react';

const API_URL = 'https://backend.jotish.in/backend_dev/gettabledata.php';

function normalizeEmployee(record, index) {
  const id =
    record.id ||
    record.employee_id ||
    record.emp_id ||
    record.uuid ||
    `${record.first_name || record.name || 'employee'}-${index}`;

  const firstName = record.first_name || record.firstname || '';
  const lastName = record.last_name || record.lastname || '';

  return {
    id: String(id),
    name: record.name || `${firstName} ${lastName}`.trim() || `Employee ${index + 1}`,
    email: record.email || 'not-provided@example.com',
    city: record.city || record.location || 'Unknown',
    department: record.department || record.team || 'General',
    salary: Number(record.salary || record.ctc || 0),
    title: record.title || record.designation || 'Associate',
    phone: record.phone || record.mobile || 'NA',
  };
}

export function useEmployeeData() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: '123456' }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.data || data.rows || data.result || [];

      if (!Array.isArray(rows)) {
        throw new Error('Unexpected API response format.');
      }

      setEmployees(rows.map(normalizeEmployee));
    } catch (err) {
      setError(err.message || 'Failed to fetch employees.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const value = useMemo(
    () => ({ employees, loading, error, refetch: fetchEmployees }),
    [employees, loading, error, fetchEmployees],
  );

  return value;
}
