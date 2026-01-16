import React from 'react'
import { useApp } from '../context/AppContext'

export default function Settings(){
  const { emojiEnabled, setEmojiEnabled } = useApp()
  return (
    <div style={{maxWidth:640, margin:'16px auto', padding:8}}>
      <h2>Configuración</h2>
      <label>
        <input type="checkbox" checked={emojiEnabled} onChange={e=>setEmojiEnabled(e.target.checked)} /> Habilitar emojis
      </label>
    </div>
  )
}
