create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

do $policy$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'site_content'
      and policyname = 'Public read site_content'
  ) then
    create policy "Public read site_content"
      on site_content for select
      to anon, authenticated
      using (true);
  end if;
end
$policy$;

insert into site_content (key, value) values
  ('hero', '{"name":"RUPANK JOSHI","tagline":"Frontend Engineer with 3+ years of experience. Analog ghosts in a digital machine. Building high-fidelity experiences through low-fidelity constraints."}'::jsonb),
  ('equipped_gear', '[{"id":"gear-1","name":"CURSOR_IDE","type":"PRIMARY_TOOL","icon":"⚙"},{"id":"gear-2","name":"REST/GRAPHQL_LINK","type":"DATA_TRANSFER","icon":"⇄"},{"id":"gear-3","name":"CI/CD_PIPELINE","type":"DEPLOY_SHIELD","icon":"▶"}]'::jsonb),
  ('system_log', '{"lines":["> Loading _hellorupank.profile...","> [OK] React 18 & Next.js App Router","> [OK] Core Web Vitals optimized","> [OK] OpenAI API connection active","> _"]}'::jsonb),
  ('resume_archive', '{"title":"Resume_Rupank.v1","sizeLabel":"143KB","format":"PDF","downloadName":"Rupank_Joshi_Resume.pdf","fileUrl":"/resume.pdf"}'::jsonb)
on conflict (key) do nothing;
