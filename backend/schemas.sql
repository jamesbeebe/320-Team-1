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

create type chat_with_user_info as (
  chat_id uuid,
  chat_name text,
  class_id int4,
  expires_at timestamptz,
  enrolled_in boolean
);

create or replace function get_all_chats_for_class(
  classId int4,
  userId uuid,
  date timestamp
)
returns setof chat_with_user_info
language sql
stable
as $$
  select
    c.id as chat_id,
    c.name as chat_name,
    c.class_id,
    c.expires_at,
    (u.user_id is not null) as enrolled_in
  from chats c
  left join user_chats u
    on u.chat_id = c.id and u.user_id = userId
  where c.class_id = classId and c.expires_at > date;
$$;


create or replace function public.get_all_chats_for_user (
  _user_id uuid
) 
RETURNS SETOF public.chats 
LANGUAGE sql STABLE 
as $$
SELECT DISTINCT c.*
FROM public.chats c
WHERE c.id IN (SELECT chat_id FROM public.user_chats WHERE user_id = _user_id );
$$;

drop function if exists public.get_all_chats_for_class;


select
  n.nspname as schema,
  p.proname as function_name,
  pg_catalog.pg_get_function_identity_arguments(p.oid) as arguments,
  pg_catalog.pg_get_function_result(p.oid) as result_type
from pg_catalog.pg_proc p
  left join pg_catalog.pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname;

-- script to poplate the chats table
INSERT INTO chats (
    class_id,
    name,
    type,
    created_at,
    expires_at
)
SELECT
    c.id AS class_id,
    -- Concatenate subject and catalog to form the chat name
    c.subject || ' ' || c.catalog AS name,
    'general' AS type,

    -- Set created_at to the current timestamp (today)
    -- PostgreSQL: NOW()
    -- MySQL: NOW() or CURDATE()
    -- SQL Server: GETDATE()
    NOW() AS created_at,

    -- Set expires_at to one year from the current date
    -- PostgreSQL: NOW() + INTERVAL '1 year'
    -- MySQL: DATE_ADD(NOW(), INTERVAL 1 YEAR)
    -- SQL Server: DATEADD(year, 1, GETDATE())
    (NOW() + INTERVAL '1 year') AS expires_at
FROM
    classes c;