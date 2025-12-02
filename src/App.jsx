import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import SafetyTips from './pages/SafetyTips'
import Admin from './pages/Admin'
import './App.css'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AppBar position="static" sx={{ bgcolor: '#0a1929' }}>
        <Toolbar>
          <img src="/images/logo.png" alt="FloodSense Logo" style={{ width: 70, height: 70, marginRight: 16, borderRadius: '50%' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FloodSense
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/alerts">Alerts</Button>
          <Button color="inherit" component={Link} to="/safetytips">Safety Tips</Button>
          <Button color="inherit" component={Link} to="/admin">Admin</Button>
        </Toolbar>
      </AppBar>

      <div className="max-w-7xl mx-auto w-full px-2 md:px-6 py-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/safetytips" element={<SafetyTips />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
