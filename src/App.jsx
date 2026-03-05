import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import LoginSignup from './components/LoginSignup.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/login" element={<LoginSignup />} />
    </Routes>
  );
};

export default App;