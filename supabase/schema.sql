-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists projects (
  id text primary key,
  title text not null,
  description text not null,
  tech_stack jsonb not null default '[]'::jsonb,
  live_url text,
  github_url text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists skills (
  id text primary key,
  name text not null,
  level text not null,
  category text[] not null default '{}',
  icon text not null,
  highlight boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists quests (
  id text primary key,
  status text not null check (status in ('active', 'completed')),
  title text not null,
  company text not null,
  period text not null,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists projects_sort_order_idx on projects (sort_order);
create index if not exists skills_sort_order_idx on skills (sort_order);
create index if not exists quests_sort_order_idx on quests (sort_order);

-- Seed data (safe to re-run: clears then inserts defaults)
truncate table projects, skills, quests;

insert into projects (id, title, description, tech_stack, live_url, github_url, image_url, sort_order) values
  ('proj-kraya-dashboard', 'Kraya AI Command Center', 'Modular analytics dashboard with SSR routes, role-based views, and real-time pipeline status for growth teams.', '["React","Next.js","TypeScript","Tailwind CSS"]', 'https://example.com/kraya-dashboard', 'https://github.com/javacatscript/kraya-dashboard', null, 0),
  ('proj-health-inventory', 'MedInventory Tracker', 'Cross-platform healthcare inventory console with live stock alerts, barcode lookup, and accessible form controls.', '["React","TypeScript","Ionic","REST APIs"]', null, 'https://github.com/javacatscript/med-inventory', null, 1),
  ('proj-terminal-portfolio', 'Terminal Portfolio v1', 'Retro terminal portfolio with quest-log experience timeline, skill filters, and save-point contact flow.', '["Next.js","React","Tailwind CSS"]', 'http://localhost:3000', 'https://github.com/javacatscript/rupank-portfolio', null, 2),
  ('proj-ai-widget', 'LLM Support Widget', 'Embeddable AI assistant panel with streaming responses, prompt presets, and graceful offline fallback states.', '["React","OpenAI API","Node.js","GraphQL"]', 'https://example.com/ai-widget', 'https://github.com/javacatscript/ai-support-widget', null, 3);

insert into skills (id, name, level, category, icon, highlight, sort_order) values
  ('skill-js', 'JS (ES6+)', 'LVL. 99', array['languages'], '{ }', false, 0),
  ('skill-react', 'React.js', 'LVL. 97', array['frontend'], '⚛', false, 1),
  ('skill-next', 'Next.js', 'LVL. 95', array['frontend'], 'NX', false, 2),
  ('skill-redux', 'Redux', 'LVL. 90', array['frontend'], 'RX', false, 3),
  ('skill-ts', 'TypeScript', 'LVL. 93', array['languages'], 'TS', false, 4),
  ('skill-rest', 'REST APIs', 'LVL. 90', array['backend'], 'AP', false, 5),
  ('skill-gql', 'GraphQL', 'LVL. 82', array['backend'], 'GQ', false, 6),
  ('skill-node', 'Node.js', 'LVL. 85', array['backend'], 'ND', false, 7),
  ('skill-mui', 'MUI', 'LVL. 90', array['frontend'], 'UI', false, 8),
  ('skill-tailwind', 'Tailwind CSS', 'LVL. 88', array['frontend'], 'TW', false, 9),
  ('skill-python', 'Python', 'LVL. 80', array['languages'], 'PY', false, 10),
  ('skill-sql', 'SQL', 'LVL. 85', array['languages'], 'DB', false, 11),
  ('skill-mongo', 'MongoDB', 'LVL. 78', array['backend'], 'MG', false, 12),
  ('skill-vitals', 'Web Vitals', 'EPIC', array['perf_ai'], '⚡', false, 13),
  ('skill-ai', 'AI/LLM', 'NEW', array['perf_ai'], '🤖', true, 14),
  ('skill-git', 'Git', 'LVL. 95', array['tools'], 'GT', false, 15),
  ('skill-cicd', 'CI/CD', 'LVL. 80', array['tools'], '▶', false, 16),
  ('skill-figma', 'Figma', 'LVL. 85', array['tools'], 'FG', false, 17),
  ('skill-claude', 'Claude Code', 'LVL. 95', array['tools'], 'CL', false, 18),
  ('skill-cursor', 'Cursor IDE', 'LVL. 99', array['tools'], 'CI', true, 19);

insert into quests (id, status, title, company, period, description, sort_order) values
  ('quest-kraya', 'active', 'Software Engineer Frontend', 'Kraya AI', 'Apr 2023 - PRESENT', 'Leading development of a modular frontend architecture using React, Next.js (App Router), and TypeScript. Achieved a 40% improvement in Core Web Vitals (notably LCP and INP) through optimized SSR/SSG strategies.', 0),
  ('quest-tongadive', 'completed', 'Frontend Engineer Intern', 'Tongadive', 'Marc 2023 - Apr 2023', 'Built a cross-platform healthcare dashboard using React, TypeScript, and Ionic, enabling real-time medical inventory tracking. Developed accessible UI components with semantic HTML and ARIA.', 1),
  ('quest-coding-ninjas', 'completed', 'React Teaching Assistant', 'Coding Ninjas', 'Dec 2022 - Apr 2023', 'Mentored students by resolving 300+ React and JavaScript queries, maintaining a 4.9/5 satisfaction rating. Conducted debugging sessions and code reviews to accelerate understanding of core frontend concepts.', 2);
  