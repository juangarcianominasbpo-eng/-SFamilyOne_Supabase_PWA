import React from 'react'
export default function PostCard({ post }){
  return (
    <div style={{border:'1px solid #eee', padding:12, borderRadius:8, background:'#fff'}}>
      <div style={{fontSize:12, color:'#555'}}>Autor: {post.author_id}</div>
      <div style={{margin:'8px 0', whiteSpace:'pre-wrap'}}>{post.text}</div>
      {post.media_url && (
        /\.(mp4|webm|ogg)$/i.test(post.media_url) ? (
          <video src={post.media_url} controls style={{maxWidth:'100%'}} />
        ) : (
          <img src={post.media_url} alt="media" style={{maxWidth:'100%'}} />
        )
      )}
    </div>
  )
}
