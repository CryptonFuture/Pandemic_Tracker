import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import ReportCases from './pages/ReportCases';
import Areas from './pages/Areas';
import CaseHistory from './pages/CaseHistory';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="container page">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/map" element={<PrivateRoute><MapView /></PrivateRoute>} />
        <Route path="/areas" element={<PrivateRoute><Areas /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><CaseHistory /></PrivateRoute>} />
        <Route path="/report" element={
          <PrivateRoute roles={['admin', 'health_worker']}><ReportCases /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
