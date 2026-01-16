import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Auth from './pages/Auth'
import Settings from './pages/Settings'
import { AppProvider } from './context/AppContext'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Feed /> },
    { path: 'profile/:uid', element: <Profile /> },
    { path: 'messages/:chatId?', element: <Messages /> },
    { path: 'settings', element: <Settings /> },
  ]},
  { path: '/auth', element: <Auth /> }
])

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error)
  })
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
)
