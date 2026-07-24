do $$
declare
  demo_email text := 'demo-admin@bklsharks.app';
  demo_password text := 'DemoAdmin#2026';
  demo_id uuid;
begin
  select id into demo_id from auth.users where email = demo_email;

  if demo_id is null then
    demo_id := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      demo_id, 'authenticated', 'authenticated', demo_email,
      crypt(demo_password, gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Demo Admin"}'::jsonb,
      '', '', '', ''
    );

    insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    values (
      gen_random_uuid(), demo_id,
      jsonb_build_object('sub', demo_id::text, 'email', demo_email, 'email_verified', true),
      'email', demo_id::text, now(), now(), now()
    );
  else
    update auth.users
      set encrypted_password = crypt(demo_password, gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          updated_at = now()
      where id = demo_id;
  end if;

  insert into public.profiles (id, display_name, handle)
  values (demo_id, 'Demo Admin', 'u_' || substr(demo_id::text, 1, 8))
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (demo_id, 'admin')
  on conflict (user_id, role) do nothing;
end $$;