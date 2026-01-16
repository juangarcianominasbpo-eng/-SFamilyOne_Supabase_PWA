
# SFamilyOne (Supabase PWA)

**Stack:** React + Vite + Supabase (Auth, Postgres, Realtime, Storage) + PWA.

Incluye:
- Feed con publicaciones (texto + imagen/video)
- Subida de archivos a **Supabase Storage** (bucket `media`)
- Chat básico en tiempo real (Postgres + Realtime)
- Perfiles con música y opción de **autoplay** (si el navegador lo permite)
- Interruptor para activar/desactivar emojis (se filtran al publicar)
- Instalación como PWA

## 1) Crear proyecto en Supabase (solo navegador)
1. Entra a https://app.supabase.com → New project.
2. Copia **Project URL** y **anon public key** (Settings → API).
3. Crea un **bucket** público llamado `media` (Storage → New bucket → Public).
4. En la sección **SQL**, pega y ejecuta `supabase/schema.sql` (tablas + RLS + policies).

## 2) Variables de entorno
En Vercel/Netlify agrega:
```
VITE_SUPABASE_URL=...        # Project URL
VITE_SUPABASE_ANON_KEY=...   # anon key
```

## 3) Despliegue (sin instalar nada)
- **Vercel**: Importa repo → variables `VITE_*` → Deploy.
- **Netlify**: Build `npm run build`, Publish `dist`, variables `VITE_*`.

## 4) Auth y creación de fila de usuario
- Al crear cuenta, se recomienda insertar su fila en `users` con un webhook o Edge Function.
- Este MVP trae una llamada a `/api/create-user` para registrar el usuario tras `signUp`.
  Puedes implementar esa ruta en Vercel (Serverless Function) o crear un **Trigger** en la DB:

### Opción rápida: trigger SQL
```sql
create or replace function handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, display_name)
  values (new.id, coalesce(new.email, 'user')); 
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_auth_user();
```

## 5) Tablas principales
- `users(id, display_name, photo_url, music_url, autoplay_music)`
- `posts(id, author_id, text, media_url, created_at)`
- `chats`, `chat_members`, `messages` para DM en tiempo real.

## 6) Notas
- Autoplay de música depende del navegador y políticas de interacción del usuario.
- Realtime funciona suscribiéndose a cambios de Postgres (`postgres_changes`).

## 7) Próximos pasos
- Crear UI para **nuevos chats** y búsqueda de usuarios.
- Likes/comentarios, notificaciones push, moderación.
- Endurecer policies (por ejemplo, limitar lectura de mensajes solo a miembros).

Licencia: MIT
