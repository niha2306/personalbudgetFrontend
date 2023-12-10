import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './Home';
import Login from './Login'
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Register from './Register';
import SignOut from './SignOut';
import { checkJWTExpired } from './utils';
import axios from 'axios';

function App() {
  setInterval(() => {
    const refreshToken = async (token) => {
      const response = await axios.post('https://lazy-plum-blackbuck-hem.cyclic.app/login/refresh', { token: token });
      const resData = response.data;
      localStorage.setItem('token', resData?.data?.token);
      localStorage.setItem('userId', resData?.data?.id);
    }
    const token = localStorage.getItem('token');
    if (token) {
      const userConsent = window.confirm('Your session is about to expire. Do you want to refresh your token?');
      if (userConsent) {
        refreshToken(token);
      }

    }
  }, 60000)
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/logout' element={<SignOut />} />
      </Routes>
    </Router>
  );
}

export default App;
