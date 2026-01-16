import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import PostComposer from '../components/PostComposer'
import PostCard from '../components/PostCard'

export default function Feed(){
  const [posts, setPosts] = useState([])

  const load = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setPosts(data)
  }

  useEffect(()=>{
    load()
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },[])

  return (
    <div style={{maxWidth:640, margin:'16px auto', padding:8}}>
      <PostComposer />
      <div style={{display:'grid', gap:12, marginTop:12}}>
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  )
}
