
import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { supabase } from './services/supabase'

export default function App() {
  const { user } = useApp()
  const nav = useNavigate()

  const signOut = async () => {
    await supabase.auth.signOut()
    nav('/auth')
  }

  return (
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          borderBottom: '1px solid #eee'
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: '#0ea5e9',
            fontWeight: 700
          }}
        >
          SFamilyOne
        </Link>

        <nav style={{ display: 'flex', gap: 8 }}>
          <Link to="/">Inicio</Link>

          {user && (
            <Link to={`/profile/${user.id}`}>
              Mi perfil
            </Link>
          )}

          <Link to="/messages">Mensajes</Link>
          <Link to="/settings">Configuración</Link>
        </nav>

        <div style={{ marginLeft: 'auto' }}>
          {user ? (
            <button onClick={signOut}>Salir</button>
          ) : (
            <button onClick={() => nav('/auth')}>Entrar</button>
          )}
        </div>
      </header>

      <Outlet />
    </div>
  )
}
