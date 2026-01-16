import React, { useState } from 'react'
import { supabase } from '../services/supabase'

export default function Auth(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return alert(error.message)
    // create user row
    if (data.user){
      await fetch('/api/create-user', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id: data.user.id, email }) })
    }
  }

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  return (
    <div style={{maxWidth:420, margin:'16px auto', padding:8}}>
      <h2>Entrar a SFamilyOne</h2>
      <div style={{display:'grid', gap:8}}>
        <input placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={signIn}>Iniciar sesión</button>
        <button onClick={signUp}>Crear cuenta</button>
      </div>
    </div>
  )
}
