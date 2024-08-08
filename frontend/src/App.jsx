import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router , Routes,Route, useNavigate} from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
function App() {
  const URL=import.meta.env.VITE_REACT_APP_BACKEND_URL;


  return (
    <main>
      <Router>
        <Routes>
          <Route path='/'  element={<Home/>} />
          <Route path='/register' element={<Register URL={URL}/>} />
          <Route path='/login' element={<Login URL={URL}/>} />
          <Route path='/:userId'  element={<Home/>} />
        </Routes>
      </Router>
    </main>
  )
}

export default App
