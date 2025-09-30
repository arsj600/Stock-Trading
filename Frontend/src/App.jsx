
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import './index.css'
import  {Home}  from './pages/Home'

import { StocksList } from './pages/StocksList'
import { Edu } from './pages/Edu'
import { Login } from './pages/Login'
import { About } from './pages/About'
import { Support } from './pages/Support'
import { Footer } from './components/Footer'
import { Profile } from './pages/Profile'
import  WatchList  from './pages/WatchList'
import { Social } from './pages/Social'
import { Stock } from './pages/Stock'
import { ToastContainer, toast } from 'react-toastify';
import { Order } from './pages/Order'
import Verify from './pages/Verify'
import { Dashboard } from './pages/DashBoard'
import { ProtectedRoute } from "./components/ProtectedRoute"; 

function App() {
  
  return (
    <div>
    <BrowserRouter>
         <ToastContainer/>
        <Navbar/>
        <Routes>
  {/* Public routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/about" element={<About />} />
  <Route path="/support" element={<Support />} />
  <Route path="/edu" element={<Edu />} /> {/* optional public */}

  {/* Protected routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/stocklist"
    element={
      <ProtectedRoute>
        <StocksList />
      </ProtectedRoute>
    }
  />
  <Route
    path="/stock/:symbol"
    element={
      <ProtectedRoute>
        <Stock />
      </ProtectedRoute>
    }
  />
  <Route
    path="/order"
    element={
      <ProtectedRoute>
        <Order />
      </ProtectedRoute>
    }
  />
  <Route
    path="/verify"
    element={
      <ProtectedRoute>
        <Verify />
      </ProtectedRoute>
    }
  />
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
  <Route
    path="/watchlist"
    element={
      <ProtectedRoute>
        <WatchList />
      </ProtectedRoute>
    }
  />
  <Route
    path="/social"
    element={
      <ProtectedRoute>
        <Social />
      </ProtectedRoute>
    }
  />
</Routes>
        <Footer/>
        </BrowserRouter>
    </div>
  )
}

export default App
