import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import AlgoPage from './pages/AlgoPages';
function App() {

 
 
  return (
  <Router>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path="/algo" element={<AlgoPage />} />
    </Routes>


  </Router>
  )
}

export default App
