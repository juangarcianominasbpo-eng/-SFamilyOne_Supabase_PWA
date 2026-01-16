import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useApp } from '../context/AppContext'

export default function Profile(){
  const { uid } = useParams()
  const { user } = useApp()
  const [profile, setProfile] = useState(null)
  const [music, setMusic] = useState(null)
  const [autoplay, setAutoplay] = useState(true)

  const load = async () => {
    const { data } = await supabase.from('users').select('*').eq('id', uid).single()
    setProfile(data)
    if (data && typeof data.autoplay_music === 'boolean') setAutoplay(data.autoplay_music)
  }

  useEffect(()=>{ load() }, [uid])

  const uploadMusic = async () => {
    if (!user || user.id !== uid) return alert('No autorizado')
    if (!music) return
    const filePath = `music/${uid}/${music.name}`
    const { error: upErr } = await supabase.storage.from('media').upload(filePath, music, { upsert: true })
    if (upErr) return alert(upErr.message)
    const { data } = supabase.storage.from('media').getPublicUrl(filePath)
    const { error } = await supabase.from('users').update({ music_url: data.publicUrl }).eq('id', uid)
    if (!error){
      setProfile(prev=> ({...prev, music_url: data.publicUrl}))
    }
  }

  const toggleAutoplay = async () => {
    if (!user || user.id !== uid) return
    const { error } = await supabase.from('users').update({ autoplay_music: !autoplay }).eq('id', uid)
    if (!error) setAutoplay(!autoplay)
  }

  return (
    <div style={{maxWidth:720, margin:'16px auto', padding:8}}>
      <h2>Perfil</h2>
      {profile ? (
        <div>
          <div><strong>Usuario:</strong> {uid}</div>
          {profile.music_url && (
            <audio src={profile.music_url} controls autoPlay={autoplay} />
          )}
          {user && user.id === uid && (
            <div style={{marginTop:12}}>
              <input type="file" accept="audio/*" onChange={e=>setMusic(e.target.files[0])} />
              <button onClick={uploadMusic}>Subir música</button>
              <label style={{marginLeft:12}}>
                <input type="checkbox" checked={autoplay} onChange={toggleAutoplay} /> Reproducir automáticamente
              </label>
              <div style={{fontSize:12, color:'#666', marginTop:6}}>
                Nota: el navegador puede bloquear el autoplay con sonido.
              </div>
            </div>
          )}
        </div>
      ) : <div>Cargando…</div>}
    </div>
  )
}
