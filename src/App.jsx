import Shell from './components/Shell';
import { useAuth } from './contexts/AuthContext';
import { useRoute } from './hooks/useRoute';
import LoginPage from './pages/LoginPage';
import ListPage from './pages/ListPage';
import DetailsPage from './pages/DetailsPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App = () => {
  const { user } = useAuth();
  const { path, navigate } = useRoute();

  if (!user) {
    return <LoginPage />;
  }

  let page = <ListPage navigate={navigate} />;
  if (path.startsWith('/details/')) {
    page = <DetailsPage navigate={navigate} employeeId={path.replace('/details/', '')} />;
  } else if (path === '/analytics') {
    page = <AnalyticsPage />;
  }

  return (
    <Shell path={path} navigate={navigate}>
      {page}
    </Shell>
  );
};

export default App;
