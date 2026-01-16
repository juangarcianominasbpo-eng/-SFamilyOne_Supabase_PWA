import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../services/supabase'
import { stripEmojis } from '../utils/emoji'

export default function PostComposer(){
  const { user, emojiEnabled } = useApp()
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!user) return alert('Inicia sesión para publicar')
    setLoading(true)
    try{
      let media_url = null
      if (file){
        const filePath = `posts/${user.id}/${Date.now()}_${file.name}`
        const { error: upErr } = await supabase.storage.from('media').upload(filePath, file)
        if (upErr) throw upErr
        const { data } = supabase.storage.from('media').getPublicUrl(filePath)
        media_url = data.publicUrl
      }
      const { error } = await supabase.from('posts').insert({
        author_id: user.id,
        text: emojiEnabled ? text : stripEmojis(text),
        media_url
      })
      if (error) throw error
      setText('')
      setFile(null)
    }catch(err){
      alert('Error al publicar: ' + err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{border:'1px solid #ddd', padding:12, borderRadius:8}}>
      <textarea placeholder="¿Qué estás pensando?" value={text} onChange={e=>setText(e.target.value)} style={{width:'100%', minHeight:70}} />
      <div style={{display:'flex', gap:8, alignItems:'center', marginTop:8}}>
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit" disabled={loading}>{loading ? 'Publicando…' : 'Publicar'}</button>
      </div>
    </form>
  )
}
