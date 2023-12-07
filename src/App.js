import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './Home';
import Login from './Login'
import Navbar from './Navbar';
import Dashboard from './Dashboard';

function App() {
  return (
    <Navbar>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard'element={<Dashboard />} />
        </Routes>
      </Router>
    </Navbar>
  );
}

export default App;
