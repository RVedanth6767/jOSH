import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Employee List', to: '/list' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'City Map', to: '/map' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <h2>Insights</h2>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button className="danger" onClick={logout} type="button">
        Logout
      </button>
    </aside>
  );
}
