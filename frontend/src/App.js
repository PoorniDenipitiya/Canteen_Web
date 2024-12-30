import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import Signup from './User/Signup';
import Login from './User/Login';
import Home from './Home/Home';
import Header from './Components/Header';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from './Components/Footer';
import Canteen from './Canteen/Canteen';
import './App.css';

function App() {

  return (
    <AuthProvider>
    <BrowserRouter>
    <div className="app-container">
      <Header className="fixed-header" />
      <div className="content">
        <Routes>
         
          <Route path='/register' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/' element={<Home />}/>
          <Route path="/canteen" element={Canteen} />
        </Routes>
        </div>
        <Footer className="fixed-footer" />
      
    </div>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App