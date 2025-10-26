create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  major text,
  grad_year int,
  created_at timestamptz default now()
);

CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    class_id INT4,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL,  -- Changed this line from UID to UUID
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    content TEXT,
    
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- trigger to inser user into users table from auth.users upon signup
create or replace function insert_public_user()
returns trigger
language plpgsql
as $$
begin
  insert into public.users (id, name, major, grad_year, created_at)
  values (
    new.id,
    new.raw_user_metadata->>'name',
    new.raw_user_meta_data->>'major',
    new.raw_user_meta_data-->'gradYear'::int,
  );
  
  return new;
end;
$$;

1b6cd7de-c6ed-434a-953d-7ff9da5d6ac0

f3c4b727-98a5-4a07-9384-859a02ef6f9b