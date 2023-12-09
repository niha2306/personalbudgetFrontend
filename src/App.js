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

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard'element={<Dashboard />} />
          <Route path='/signup' element={<Register />} />
        </Routes>
      </Router>
  );
}

export default App;
