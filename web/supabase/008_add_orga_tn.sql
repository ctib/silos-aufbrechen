-- ============================================================
-- 008: Meike Wocken und Tammo Peters als Orga-TN hinzufügen
-- ============================================================
-- WICHTIG: Auf Supabase SQL-Editor ausführen!
-- ============================================================

-- ----- Meike Wocken -----
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'meike.wocken@haw-kiel.de';

  IF v_user_id IS NULL THEN
    INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data, created_at, updated_at, instance_id, aud, role)
    VALUES (
      gen_random_uuid(),
      'meike.wocken@haw-kiel.de',
      now(),
      jsonb_build_object('full_name', 'Meike Wocken'),
      now(), now(),
      '00000000-0000-0000-0000-000000000000'::uuid,
      'authenticated', 'authenticated'
    )
    RETURNING id INTO v_user_id;
  END IF;

  -- Profil anlegen/aktualisieren
  INSERT INTO profiles (id, full_name, email, role, background, gdpr_consent, gdpr_consent_date)
  VALUES (v_user_id, 'Meike Wocken', 'meike.wocken@haw-kiel.de', 'orga', 'Wirtschaftsinformatik', true, now())
  ON CONFLICT (id) DO UPDATE SET
    full_name = 'Meike Wocken',
    role = 'orga';

  -- Registrierung anlegen
  INSERT INTO registrations (profile_id, attends_lecture, attends_workshop, attends_dinner, source)
  VALUES (v_user_id, true, true, true, 'manual')
  ON CONFLICT (profile_id) DO NOTHING;
END $$;

-- ----- Tammo Peters -----
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tammo.peters@haw-kiel.de';

  IF v_user_id IS NULL THEN
    INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data, created_at, updated_at, instance_id, aud, role)
    VALUES (
      gen_random_uuid(),
      'tammo.peters@haw-kiel.de',
      now(),
      jsonb_build_object('full_name', 'Tammo Peters'),
      now(), now(),
      '00000000-0000-0000-0000-000000000000'::uuid,
      'authenticated', 'authenticated'
    )
    RETURNING id INTO v_user_id;
  END IF;

  -- Profil anlegen/aktualisieren
  INSERT INTO profiles (id, full_name, email, role, background, gdpr_consent, gdpr_consent_date)
  VALUES (v_user_id, 'Tammo Peters', 'tammo.peters@haw-kiel.de', 'orga', 'Grünlandwirtschaft', true, now())
  ON CONFLICT (id) DO UPDATE SET
    full_name = 'Tammo Peters',
    role = 'orga';

  -- Registrierung anlegen
  INSERT INTO registrations (profile_id, attends_lecture, attends_workshop, attends_dinner, source)
  VALUES (v_user_id, true, true, true, 'manual')
  ON CONFLICT (profile_id) DO NOTHING;
END $$;
