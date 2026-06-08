create extension if not exists postgis;

create type public.app_role as enum ('public', 'admin');
create type public.review_status as enum ('pending', 'approved', 'hidden');
create type public.hospital_ownership as enum ('Public', 'Private', 'Mission');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'public',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.hospitals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  facility_type text not null,
  ownership public.hospital_ownership not null,
  address text not null,
  city text not null,
  state text not null,
  lga text not null,
  phone text not null,
  email text,
  location geography(point, 4326) not null,
  specialties text[] not null default '{}',
  services text[] not null default '{}',
  amenities text[] not null default '{}',
  equipment text[] not null default '{}',
  visiting_hours text,
  description_markdown text,
  emergency_24h boolean not null default false,
  ambulance_available boolean not null default false,
  verified boolean not null default false,
  price_level smallint check (price_level between 1 and 3),
  image_path text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index hospitals_location_idx on public.hospitals using gist(location);
create index hospitals_state_idx on public.hospitals(state);
create index hospitals_specialties_idx on public.hospitals using gin(specialties);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  review_text text check (char_length(review_text) <= 2000),
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(hospital_id, user_id)
);

create table public.hospital_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references public.profiles(id),
  payload jsonb not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.hospitals_within_radius(
  latitude double precision,
  longitude double precision,
  radius_km double precision default 10
)
returns table (
  id uuid,
  slug text,
  name text,
  address text,
  city text,
  state text,
  distance_km double precision
)
language sql
stable
set search_path = ''
as $$
  select
    h.id,
    h.slug,
    h.name,
    h.address,
    h.city,
    h.state,
    st_distance(
      h.location,
      st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
    ) / 1000 as distance_km
  from public.hospitals h
  where st_dwithin(
    h.location,
    st_setsrid(st_makepoint(longitude, latitude), 4326)::geography,
    radius_km * 1000
  )
  order by distance_km;
$$;

alter table public.profiles enable row level security;
alter table public.hospitals enable row level security;
alter table public.reviews enable row level security;
alter table public.hospital_submissions enable row level security;

create policy "Profiles are readable by owner and admins"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "Users can update their profile without changing role"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Hospitals are publicly readable"
on public.hospitals for select
using (true);

create policy "Only admins can create hospitals"
on public.hospitals for insert
with check (public.is_admin());

create policy "Only admins can update hospitals"
on public.hospitals for update
using (public.is_admin())
with check (public.is_admin());

create policy "Only admins can delete hospitals"
on public.hospitals for delete
using (public.is_admin());

create policy "Approved reviews and own reviews are readable"
on public.reviews for select
using (status = 'approved' or user_id = auth.uid() or public.is_admin());

create policy "Authenticated users can create their own review"
on public.reviews for insert
to authenticated
with check (user_id = auth.uid() and status = 'pending');

create policy "Users can update their pending review"
on public.reviews for update
to authenticated
using (user_id = auth.uid() and status = 'pending')
with check (user_id = auth.uid() and status = 'pending');

create policy "Admins can moderate reviews"
on public.reviews for update
using (public.is_admin())
with check (public.is_admin());

create policy "Public users can submit facility information"
on public.hospital_submissions for insert
with check (submitted_by is null or submitted_by = auth.uid());

create policy "Admins can manage submissions"
on public.hospital_submissions for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('hospital-images', 'hospital-images', true)
on conflict (id) do nothing;

create policy "Hospital images are publicly readable"
on storage.objects for select
using (bucket_id = 'hospital-images');

create policy "Admins manage hospital images"
on storage.objects for all
using (bucket_id = 'hospital-images' and public.is_admin())
with check (bucket_id = 'hospital-images' and public.is_admin());
