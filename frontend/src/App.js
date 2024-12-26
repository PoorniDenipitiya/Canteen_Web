import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import Signup from './User/Signup';
import Login from './User/Login';
import Home from './Home/Home';
import Header from './Components/Header';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {

  return (
    <AuthProvider>
    <BrowserRouter>
    <div>
      <Header />
      
        <Routes>
         
          <Route path='/register' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/home' element={<Home />}/>
        </Routes>
      
    </div>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App