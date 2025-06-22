import './App.css';
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ChatPage from "./pages/Chat";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import SelectRoomPage from './pages/SelectRoom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/select-room"
            element={<PrivateRoute><SelectRoomPage /></PrivateRoute>}
          />
          <Route
            path="/chat/:room"
            element={<PrivateRoute><ChatPage /></PrivateRoute>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;




