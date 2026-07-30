drop policy if exists "media staff read" on storage.objects;
create policy "media staff read" on storage.objects for select to authenticated
  using (bucket_id = 'media');

drop policy if exists "media staff write" on storage.objects;
create policy "media staff write" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'moderator')));

drop policy if exists "media staff update" on storage.objects;
create policy "media staff update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'moderator')));

drop policy if exists "media staff delete" on storage.objects;
create policy "media staff delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'moderator')));

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);