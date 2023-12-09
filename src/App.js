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

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard'element={<Dashboard />} />
        </Routes>
      </Router>
  );
}

export default App;
