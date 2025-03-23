create table profiles (
  id uuid primary key default auth.uid(),
  profile_image text,
  email text unique,
  cpf text unique,
  phone_number text,
  first_name text,
  last_name text,
  role text not null default 'PASSENGER' check (role in ('DRIVER', 'PASSENGER'))
);

create table trips (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references profiles(id) on delete cascade,
  departure timestamp not null,
  origin text not null,
  destination text not null,
  seats int not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  passenger_id uuid references profiles(id) on delete cascade,
  pickup_point text not null,
  dropoff_point text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'CANCELED')),
  created_at timestamp default now(),
  updated_at timestamp default now()
);


