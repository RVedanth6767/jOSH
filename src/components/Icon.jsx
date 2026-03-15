const PATHS = {
  users: 'M3 17v-1c0-2.2 1.8-4 4-4h10c2.2 0 4 1.8 4 4v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  chart: 'M4 19h16M7 16V8m5 8V5m5 11v-6',
  pin: 'M12 21s-7-5.7-7-11a7 7 0 1 1 14 0c0 5.3-7 11-7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  search: 'm21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z'
};

const Icon = ({ name, size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={PATHS[name] || PATHS.users} />
  </svg>
);

export default Icon;
