import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useApp } from '../context/AppContext'

export default function Messages(){
  const { user } = useApp()
  const { chatId } = useParams()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(()=>{
    if (!chatId) return
    const load = async () => {
      const { data } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true })
      setMessages(data || [])
    }
    load()
    const channel = supabase
      .channel('messages-'+chatId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, load)
      .subscribe()
    return ()=> supabase.removeChannel(channel)
  }, [chatId])

  const send = async (e) => {
    e.preventDefault()
    if (!user || !chatId) return
    await supabase.from('messages').insert({ chat_id: chatId, sender_id: user.id, text })
    setText('')
  }

  return (
    <div style={{maxWidth:720, margin:'16px auto', padding:8}}>
      <h2>Mensajes</h2>
      {!chatId && <div>Elige una conversación</div>}
      {chatId && (
        <div>
          <div style={{border:'1px solid #eee', padding:8, minHeight:300}}>
            {messages.map(m => (
              <div key={m.id} style={{margin:'6px 0'}}><strong>{m.sender_id}</strong>: {m.text}</div>
            ))}
          </div>
          <form onSubmit={send} style={{display:'flex', gap:8, marginTop:8}}>
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe un mensaje" style={{flex:1}} />
            <button>Enviar</button>
          </form>
        </div>
      )}
    </div>
  )
}
