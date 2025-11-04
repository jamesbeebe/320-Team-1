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
    type VARCHAR(255),
    
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

CREATE TABLE user_chats (
  user_id UUID,
  chat_id UUID,

  PRIMARY KEY(user_id, chat_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (chat_id) REFERENCES chats(id)
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

create or replace function public.create_chat_and_enroll_user(
  user_id uuid,
  chat_name varchar(255),
  class_id int4,
  expires_at timestamptz
)
returns uuid as $$
declare
  new_chat_id uuid;
begin
  insert into chats (name, class_id, expires_at, type)
  values (chat_name, class_id, expires_at, 'study-group')
  returning id into new_chat_id;

  insert into user_chats(user_id, chat_id)
  values (user_id, new_chat_id);

  return new_chat_id;

exception
  when others then
    raise;
end;
$$ language plpgsql;

1b6cd7de-c6ed-434a-953d-7ff9da5d6ac0

f3c4b727-98a5-4a07-9384-859a02ef6f9b