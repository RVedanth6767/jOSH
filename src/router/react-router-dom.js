import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const RouterContext = createContext(null);
const ParamsContext = createContext({});
const OutletContext = createContext(null);

function normalize(path) {
  if (!path) return '/';
  if (path !== '/' && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

function joinPaths(base, path) {
  if (!path) return normalize(base || '/');
  if (path.startsWith('/')) return normalize(path);
  const root = normalize(base || '/');
  return normalize(`${root === '/' ? '' : root}/${path}`);
}

function matchPattern(pattern, pathname) {
  if (pattern === '*') return {};
  const cleanPattern = normalize(pattern);
  const cleanPath = normalize(pathname);
  const pSeg = cleanPattern.split('/').filter(Boolean);
  const uSeg = cleanPath.split('/').filter(Boolean);

  if (pSeg.length !== uSeg.length) return null;

  const params = {};
  for (let i = 0; i < pSeg.length; i += 1) {
    const part = pSeg[i];
    const value = uSeg[i];
    if (part.startsWith(':')) {
      params[part.slice(1)] = decodeURIComponent(value);
    } else if (part !== value) {
      return null;
    }
  }

  return params;
}

function buildRouteObjects(children) {
  return Children.toArray(children)
    .filter(isValidElement)
    .map((child) => ({
      path: child.props.path,
      element: child.props.element || null,
      children: buildRouteObjects(child.props.children),
    }));
}

function renderElement(element, outlet, params) {
  if (!element) {
    return outlet;
  }

  return (
    <ParamsContext.Provider value={params}>
      <OutletContext.Provider value={outlet}>{element}</OutletContext.Provider>
    </ParamsContext.Provider>
  );
}

function matchAndRender(routeObjects, pathname, basePath = '/', inheritedParams = {}) {
  for (const route of routeObjects) {
    const hasPath = route.path !== undefined;
    const fullPath = hasPath ? joinPaths(basePath, route.path) : basePath;

    if (route.path === '*') {
      return renderElement(route.element, null, inheritedParams);
    }

    if (!hasPath) {
      const childRender = matchAndRender(route.children, pathname, fullPath, inheritedParams);
      if (childRender) {
        return renderElement(route.element, childRender.node, childRender.params);
      }
      continue;
    }

    const params = matchPattern(fullPath, pathname);
    if (params) {
      const mergedParams = { ...inheritedParams, ...params };
      const childRender = matchAndRender(route.children, pathname, fullPath, mergedParams);
      return {
        node: renderElement(route.element, childRender?.node || null, childRender?.params || mergedParams),
        params: childRender?.params || mergedParams,
      };
    }

    if (route.children.length) {
      const childRender = matchAndRender(route.children, pathname, fullPath, inheritedParams);
      if (childRender) {
        return {
          node: renderElement(route.element, childRender.node, childRender.params),
          params: childRender.params,
        };
      }
    }
  }

  return null;
}

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(() => ({
    pathname: window.location.pathname,
    state: window.history.state?.state,
  }));

  useEffect(() => {
    const onPop = () => {
      setLocation({ pathname: window.location.pathname, state: window.history.state?.state });
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to, options = {}) => {
    const target = normalize(to || '/');
    const nextState = options.state;
    if (options.replace) {
      window.history.replaceState({ state: nextState }, '', target);
    } else {
      window.history.pushState({ state: nextState }, '', target);
    }
    setLocation({ pathname: target, state: nextState });
  };

  const value = useMemo(() => ({ location, navigate }), [location]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Routes({ children }) {
  const { location } = useContext(RouterContext);
  const routeObjects = useMemo(() => buildRouteObjects(children), [children]);
  const matched = useMemo(() => matchAndRender(routeObjects, location.pathname), [routeObjects, location.pathname]);

  return matched?.node || null;
}

export function Route() {
  return null;
}

export function Navigate({ to, replace = false, state }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, replace, state, to]);

  return null;
}

export function useNavigate() {
  const ctx = useContext(RouterContext);
  return ctx.navigate;
}

export function useLocation() {
  const ctx = useContext(RouterContext);
  return ctx.location;
}

export function useParams() {
  return useContext(ParamsContext);
}

export function Outlet() {
  return useContext(OutletContext);
}

export function Link({ to, children, onClick, ...rest }) {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (onClick) onClick(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

export function NavLink({ to, className, children, ...rest }) {
  const { pathname } = useLocation();
  const isActive = normalize(pathname) === normalize(to);
  const computedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link className={computedClassName} to={to} {...rest}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </Link>
  );
}
