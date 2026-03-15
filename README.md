# Employee Insights Dashboard

A React + Vite dashboard for employee operations featuring authentication, API-backed employee records, custom row virtualization, detail capture workflows (camera + signature), analytics visualizations, and geospatial city mapping.

## Tech Stack

- React 18
- Vite 5
- React Router 6
- Plain CSS (no UI framework)

## Architecture Overview

```text
src/
  components/
    AppLayout.jsx             # Shell with sidebar + routed content
    ProtectedRoute.jsx        # Auth gate for private routes
    Sidebar.jsx               # App navigation + logout
    VirtualizedEmployeeTable.jsx
  context/
    AuthContext.jsx           # Global auth state + localStorage persistence
  hooks/
    useEmployeeData.js        # Shared API fetching logic, loading/error handling
  pages/
    LoginPage.jsx             # /login
    EmployeeListPage.jsx      # /list
    EmployeeDetailsPage.jsx   # /details/:id camera + signature + merge
    AnalyticsPage.jsx         # /analytics raw SVG bar chart
    MapPage.jsx               # /map geospatial points via SVG
  utils/
    cityCoordinates.js        # city -> x/y map coordinates
```

## Routing and Authentication

- Public route: `/login`
- Protected routes: `/list`, `/details/:id`, `/analytics`, `/map`
- Valid credentials:
  - Username: `testuser`
  - Password: `Test123`
- Auth state is managed using React Context and persisted through `localStorage` (`employee_dashboard_auth`).
- If unauthenticated users hit `/list` (or any protected route), they are redirected to `/login`.
- Session survives refresh due to `localStorage` bootstrapping in context state initializer.

## API Integration

Employee data is fetched using:

- **POST** `https://backend.jotish.in/backend_dev/gettabledata.php`
- Payload:

```json
{
  "username": "test",
  "password": "123456"
}
```

Implementation details:
- `useEmployeeData` performs fetch in a `useEffect`.
- Handles:
  - loading state (`loading`)
  - API/parse errors (`error`)
  - normalized row schema for cross-page usage
- Exposes `refetch` for manual refresh.

## Custom Virtualization (Manual, No Library)

The employee list uses a manually implemented virtualized table for large datasets.

Constants:
- `rowHeight = 52`
- `containerHeight = 540`
- `buffer = 6`

Math:

```text
startIndex = floor(scrollTop / rowHeight) - buffer
visibleRows = ceil(containerHeight / rowHeight)
endIndex = startIndex + visibleRows + buffer*2
```

Render strategy:
- Render only `rows.slice(startIndex, endIndex)` in DOM.
- Add top spacer (`startIndex * rowHeight`) and bottom spacer (`(totalRows - endIndex) * rowHeight`) so total scroll height remains correct.

This keeps DOM node count small and scroll smooth.

## Employee Details: Camera + Signature + Merge

On `/details/:id`:

1. Camera starts through native browser API: `navigator.mediaDevices.getUserMedia({ video: true })`.
2. Clicking **Capture Photo** draws current video frame to a canvas and stores a PNG data URL.
3. Signature is drawn on a dedicated HTML5 canvas via pointer/touch handlers.
4. Clicking **Merge Photo + Signature** creates a composite canvas:
   - draw photo first
   - draw signature canvas overlay near bottom
   - export final image as Base64 PNG (`toDataURL`) and preview it.

## Analytics (Raw SVG)

The analytics page aggregates salaries by city and renders bars in plain SVG (`<rect>`, `<text>`) with no charting library.

- Calculates total salary per city.
- Selects top 8 cities.
- Uses proportional bar height based on max city total.

## Geospatial City Map

The map page uses a simple custom SVG map with city markers.

### City-to-coordinate conversion

- A curated dictionary maps city names (e.g., `Mumbai`, `Delhi`) to fixed SVG coordinates (`x`, `y`) in `src/utils/cityCoordinates.js`.
- During rendering, employee counts are grouped by city and plotted as circles on the SVG.
- Circle radius scales with employee count.

## Router Compatibility Note

To prevent the `Failed to resolve import "react-router-dom"` runtime error in environments where package installation is restricted, the project provides a local compatibility implementation at `src/router/react-router-dom.js` and aliases `react-router-dom` in Vite config. Existing imports remain unchanged while the app still supports:

- `BrowserRouter`
- `Routes`/`Route`
- `Navigate`
- `Link`/`NavLink`
- `useNavigate`, `useLocation`, `useParams`
- `Outlet`

## Performance Optimizations

- `React.memo` for virtualized table component.
- `useMemo` for expensive derived data:
  - filtered employees
  - salary aggregation
  - map point aggregation
  - virtualization index calculations
- `useCallback` for stable handlers (`login`, `logout`, `fetchEmployees`, scroll handler).
- Virtualization ensures minimal DOM nodes in the employee list.

## Intentional Bug (Exactly One)

⚠️ **Intentional bug included in `src/pages/MapPage.jsx`:**

- `window.addEventListener('resize', onResize)` is registered inside `useEffect` **without cleanup**.
- This creates a memory leak when the map page unmounts/remounts repeatedly.

This bug is intentional for assessment requirements. No other intentional bugs are introduced.

## Run Instructions

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```

### If you still see import resolution errors

1. Remove stale dependencies: `rm -rf node_modules package-lock.json`
2. Reinstall packages: `npm install`
3. Restart dev server: `npm run dev`

