
-- Roles enum and table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Reusable updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Section visibility (hide/show whole sections)
create table public.section_settings (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  visible boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.section_settings enable row level security;
create trigger section_settings_updated before update on public.section_settings
  for each row execute function public.set_updated_at();

create policy "Anyone can view sections"
  on public.section_settings for select
  using (true);
create policy "Admins manage sections"
  on public.section_settings for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.section_settings (section_key, sort_order) values
  ('hero', 0),
  ('about', 1),
  ('education', 2),
  ('skills', 3),
  ('projects', 4),
  ('achievements', 5),
  ('interests', 6),
  ('contact', 7);

-- Hero / about content (single row store via key/value json)
create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
create trigger site_content_updated before update on public.site_content
  for each row execute function public.set_updated_at();

create policy "Anyone can view site content"
  on public.site_content for select using (true);
create policy "Admins manage site content"
  on public.site_content for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.site_content (key, value) values
  ('hero', jsonb_build_object(
    'name', 'G NAGACHANDAN',
    'tagline', 'Aspiring Computer Science Engineer',
    'roles', jsonb_build_array('AI Developer','MERN Stack Developer','Problem Solver'),
    'available', true
  )),
  ('about', jsonb_build_object(
    'body', 'Aspiring Computer Science Engineer with experience in MERN stack, Python, and AI-based systems. Skilled in building scalable web apps, REST APIs, and computer vision solutions like defect detection.',
    'stats', jsonb_build_array(
      jsonb_build_object('k','Projects','v','10+'),
      jsonb_build_object('k','Hackathons','v','3'),
      jsonb_build_object('k','CGPA','v','8.82')
    )
  )),
  ('contact_info', jsonb_build_object(
    'email','gnagachandan@gmail.com',
    'linkedin','https://www.linkedin.com/in/g-nagachandan',
    'github','https://github.com/g-nagachandan'
  ));

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text,
  description text,
  points text[] not null default '{}',
  github_url text,
  demo_url text,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create trigger projects_updated before update on public.projects
  for each row execute function public.set_updated_at();
create policy "Anyone can view visible projects"
  on public.projects for select using (visible = true);
create policy "Admins view all projects"
  on public.projects for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage projects"
  on public.projects for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.projects (title, tag, description, points, sort_order) values
  ('Blockchain Certification System','Blockchain · Security','Tamper-proof certificate verification system with automated workflow built on blockchain validation.', array['Secure verification','Tamper-proof records','Automated workflow'], 0),
  ('Nethra AI – Defect Detection','Computer Vision · AI','AI-powered industrial defect detection trained on multiple datasets with a real-time monitoring dashboard.', array['Object detection','Multi-dataset training','Live dashboard'], 1),
  ('E-Commerce Website','MERN Stack','Full-stack platform with authentication, cart, orders, and a robust REST API powered by MongoDB.', array['Auth & cart','Order management','REST APIs'], 2),
  ('Exam Result Analysis System','Data Analytics','Data analytics solution using Python and Excel for performance insights and rich visualizations.', array['Python analytics','Excel reporting','Visualizations'], 3);

-- Skill groups + skills
create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  icon text not null default 'Code2',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.skill_groups enable row level security;
create trigger skill_groups_updated before update on public.skill_groups
  for each row execute function public.set_updated_at();
create policy "Anyone can view visible skill groups"
  on public.skill_groups for select using (visible = true);
create policy "Admins manage skill groups"
  on public.skill_groups for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.skill_groups(id) on delete cascade not null,
  name text not null,
  level int not null default 80 check (level between 0 and 100),
  sort_order int not null default 0
);
alter table public.skills enable row level security;
create policy "Anyone can view skills"
  on public.skills for select using (true);
create policy "Admins manage skills"
  on public.skills for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

with g as (
  insert into public.skill_groups (title, icon, sort_order) values
    ('Programming','Code2',0),
    ('Full Stack','Layers',1),
    ('AI','Brain',2),
    ('Data','BarChart3',3),
    ('Tools','Wrench',4),
    ('Other','Megaphone',5)
  returning id, title
)
insert into public.skills (group_id, name, level, sort_order)
select g.id, s.name, s.level, s.sort_order from g
join (values
  ('Programming','Python',90,0),('Programming','Java',75,1),('Programming','JavaScript',85,2),('Programming','SQL',80,3),
  ('Full Stack','MongoDB',80,0),('Full Stack','Express.js',82,1),('Full Stack','React.js',88,2),('Full Stack','Node.js',84,3),
  ('AI','Machine Learning',82,0),('AI','Computer Vision',86,1),('AI','Agentic AI',78,2),
  ('Data','Data Analysis',85,0),('Data','Excel',90,1),('Data','Business Analytics',78,2),
  ('Tools','Git',85,0),('Tools','REST APIs',88,1),('Tools','MySQL',82,2),
  ('Other','Digital Marketing',75,0),('Other','Communication',90,1),('Other','Problem Solving',92,2)
) as s(group_title,name,level,sort_order) on s.group_title = g.title;

-- Education
create table public.education (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  place text,
  period text,
  score text,
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.education enable row level security;
create trigger education_updated before update on public.education
  for each row execute function public.set_updated_at();
create policy "Anyone can view visible education"
  on public.education for select using (visible = true);
create policy "Admins manage education"
  on public.education for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.education (title, place, period, score, sort_order) values
  ('B.E. Computer Science and Engineering','Er Perumal Manimekalai College of Engineering','2024 – 2028','CGPA: 8.82',0),
  ('Class XII','Higher Secondary','Completed','90%',1),
  ('Class X','Secondary','Completed','86%',2);

-- Achievements
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text not null default 'Trophy',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.achievements enable row level security;
create trigger achievements_updated before update on public.achievements
  for each row execute function public.set_updated_at();
create policy "Anyone can view visible achievements"
  on public.achievements for select using (visible = true);
create policy "Admins manage achievements"
  on public.achievements for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.achievements (title, description, icon, sort_order) values
  ('Hackathon Winner','1st place victory','Trophy',0),
  ('3 Hackathons','Active participation','Rocket',1),
  ('Nethra AI','Built at TN Impact Hackathon','Medal',2);

-- Certifications
create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  visible boolean not null default true
);
alter table public.certifications enable row level security;
create policy "Anyone can view certifications"
  on public.certifications for select using (visible = true);
create policy "Admins manage certifications"
  on public.certifications for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.certifications (name, sort_order) values
  ('Microsoft Business Analytics',0),('Python for Data Science',1),('Digital Marketing',2),
  ('Google Ads',3),('MS Excel',4),('TCS Young Professional',5);

-- Interests
create table public.interests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text not null default 'Brain',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.interests enable row level security;
create trigger interests_updated before update on public.interests
  for each row execute function public.set_updated_at();
create policy "Anyone can view visible interests"
  on public.interests for select using (visible = true);
create policy "Admins manage interests"
  on public.interests for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.interests (title, description, icon, sort_order) values
  ('Artificial Intelligence','Building intelligent systems that learn, reason, and adapt.','Brain',0),
  ('Computer Vision','Teaching machines to see — defect detection, object recognition.','Eye',1),
  ('Full Stack Development','Crafting end-to-end MERN experiences with clean APIs.','Code2',2),
  ('Data Analytics','Turning raw data into clear, actionable insights.','BarChart3',3),
  ('Industrial Automation','Bridging AI with the physical world for smarter factories.','Cpu',4);

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;

create policy "Anyone can submit contact messages"
  on public.contact_messages for insert
  with check (true);
create policy "Admins can read all messages"
  on public.contact_messages for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update messages"
  on public.contact_messages for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete messages"
  on public.contact_messages for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
