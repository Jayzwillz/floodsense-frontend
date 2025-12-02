import React, { useState } from 'react'
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
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useLocation } from 'react-router-dom'

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/alerts', label: 'Alerts' },
    { to: '/safetytips', label: 'Safety Tips' },
    { to: '/admin', label: 'Admin' },
  ]

  const location = useLocation()
  const iconFor = (to) => {
    if (to === '/') return <HomeIcon />
    if (to === '/dashboard') return <DashboardIcon />
    if (to === '/alerts') return <NotificationsActiveIcon />
    if (to === '/safetytips') return <HealthAndSafetyIcon />
    if (to === '/admin') return <AdminPanelSettingsIcon />
    return null
  }

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation" onClick={() => setMobileOpen(false)}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
        <img src="/images/logo.png" alt="FloodSense Logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
        <Typography variant="h6" component="div">FloodSense</Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ py: 0 }}>
        {navLinks.map((n) => {
          const active = location.pathname === n.to
          return (
            <ListItem key={n.to} disablePadding>
              <ListItemButton
                component={Link}
                to={n.to}
                sx={{
                  color: active ? '#fff' : '#cbd5e1',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
                  borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent'
                }}
              >
                <ListItemIcon sx={{ color: active ? '#93c5fd' : '#9ca3af', minWidth: 36 }}>
                  {iconFor(n.to)}
                </ListItemIcon>
                <ListItemText primary={n.label} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 2, color: '#9ca3af', fontSize: 12 }}>
        Stay safe • FloodSense
      </Box>
    </Box>
  )
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AppBar position="static" sx={{ bgcolor: '#0a1929' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'inline-flex', md: 'none' } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <img src="/images/logo.png" alt="FloodSense Logo" style={{ width: 56, height: 56, marginRight: 12, borderRadius: '50%' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FloodSense
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navLinks.map(n => (
              <Button key={n.to} color="inherit" component={Link} to={n.to}>{n.label}</Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { bgcolor: '#0a1929', color: '#e5e7eb' } }}
      >
        {drawer}
      </Drawer>

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
