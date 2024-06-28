
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Transactions from './pages/Transactions';
import Account from './pages/Account';



function App() {
  return (
    <><ToastContainer/>
    <Router>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/transactions" element={<Transactions/>}/>
      </Routes>

      
    </Router></>
  );
}

export default App;
