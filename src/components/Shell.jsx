import Icon from './Icon';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { path: '/list', label: 'Employees', icon: 'users' },
  { path: '/analytics', label: 'Analytics', icon: 'chart' }
];

const Shell = ({ path, navigate, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Employee Insights</h1>
        <nav>
          {NAV.map((item) => (
            <button
              key={item.path}
              className={path === item.path ? 'nav-item active' : 'nav-item'}
              onClick={() => navigate(item.path)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="user-meta">
          <p>{user?.email}</p>
          <button onClick={logout} className="ghost-btn">Logout</button>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
};

export default Shell;
