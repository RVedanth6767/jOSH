import { useMemo } from 'react';
import Icon from '../components/Icon';
import { useData } from '../contexts/DataContext';

const DetailsPage = ({ employeeId, navigate }) => {
  const { employees } = useData();

  const employee = useMemo(() => employees.find((entry) => entry.id === employeeId), [employees, employeeId]);

  if (!employee) {
    return (
      <section className="card">
        <h2>Employee not found</h2>
        <button onClick={() => navigate('/list')}>Back to list</button>
      </section>
    );
  }

  return (
    <section>
      <button className="ghost-btn" onClick={() => navigate('/list')}>← Back</button>
      <article className="card details-card">
        <h2>{employee.name}</h2>
        <p>{employee.email}</p>
        <div className="details-grid">
          <div><span>Employee ID</span><strong>{employee.id}</strong></div>
          <div><span>Department</span><strong>{employee.department}</strong></div>
          <div><span>City</span><strong><Icon name="pin" /> {employee.city}</strong></div>
          <div><span>Status</span><strong>{employee.status}</strong></div>
          <div><span>Performance</span><strong>{employee.performance}%</strong></div>
          <div><span>Tenure</span><strong>{employee.tenure} years</strong></div>
          <div><span>Engagement</span><strong>{employee.engagement}%</strong></div>
          <div><span>Manager</span><strong>{employee.manager}</strong></div>
        </div>
      </article>
    </section>
  );
};

export default DetailsPage;
