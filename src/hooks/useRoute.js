import { useCallback, useEffect, useState } from 'react';

const currentPath = () => window.location.hash.replace('#', '') || '/';

export const useRoute = () => {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next) => {
    window.location.hash = next;
  }, []);

  return { path, navigate };
};
