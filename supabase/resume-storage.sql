-- Run after site-content.sql (Supabase SQL Editor)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  true,
  10485760,
  array['application/pdf']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf'];

drop policy if exists "Public read resumes" on storage.objects;
create policy "Public read resumes"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'resumes');

insert into site_content (key, value) values
  (
    'resume_archive',
    '{"title":"Resume_Rupank.v1","sizeLabel":"143KB","format":"PDF","downloadName":"Rupank_Joshi_Resume.pdf","fileUrl":"/resume.pdf"}'::jsonb
  )
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();
