import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import AlgoPage from './pages/AlgoPages';
import Stats from './pages/Stats';

function App() {

 
 
  return (
  <Router>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path="/algo" element={<AlgoPage />} />
      <Route path="/stats" element={<Stats />} />

    </Routes>


  </Router>
  )
}

export default App
