
-- Tables
create table if not exists users (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  photo_url text,
  music_url text,
  autoplay_music boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists posts (
  id bigint generated always as identity primary key,
  author_id uuid references users(id) on delete cascade,
  text text,
  media_url text,
  created_at timestamp with time zone default now()
);

create table if not exists chats (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default now()
);

create table if not exists chat_members (
  chat_id bigint references chats(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  primary key (chat_id, user_id)
);

create table if not exists messages (
  id bigint generated always as identity primary key,
  chat_id bigint references chats(id) on delete cascade,
  sender_id uuid references users(id) on delete cascade,
  text text,
  created_at timestamp with time zone default now()
);

-- Storage bucket for media
-- Create a bucket named 'media' in Supabase Storage dashboard.

-- RLS (Row Level Security)
alter table users enable row level security;
alter table posts enable row level security;
alter table chats enable row level security;
alter table chat_members enable row level security;
alter table messages enable row level security;

-- Policies
create policy "Users are readable by anyone" on users for select using (true);
create policy "User owns self" on users for insert with check (auth.uid() = id);
create policy "User updates self" on users for update using (auth.uid() = id);

create policy "Posts are readable" on posts for select using (true);
create policy "Insert post if authed" on posts for insert with check (auth.uid() = author_id);
create policy "Update/delete own post" on posts for update using (auth.uid() = author_id);
create policy "Update/delete own post d" on posts for delete using (auth.uid() = author_id);

create policy "Chats readable to members" on chats for select using (
  exists (select 1 from chat_members cm where cm.chat_id = chats.id and cm.user_id = auth.uid())
);
create policy "Members manage own membership" on chat_members for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Messages readable to members" on messages for select using (
  exists (select 1 from chat_members cm where cm.chat_id = messages.chat_id and cm.user_id = auth.uid())
);
create policy "Insert message if member" on messages for insert with check (
  exists (select 1 from chat_members cm where cm.chat_id = messages.chat_id and cm.user_id = auth.uid())
);
