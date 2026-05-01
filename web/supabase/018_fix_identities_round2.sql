-- ============================================================
-- 018: Identity-Fix für alle per SQL angelegten User (Runde 2)
-- ============================================================
-- WICHTIG: Auf Supabase SQL-Editor ausführen!
--
-- Gleicher Fix wie 011, aber robuster:
-- Löscht defekte Identities und legt sie sauber neu an.
-- Repariert auch raw_app_meta_data, raw_user_meta_data,
-- encrypted_password und is_sso_user.
-- ============================================================

DO $$
DECLARE
  rec RECORD;
  v_fixed int := 0;
BEGIN
  FOR rec IN
    SELECT id, email, raw_user_meta_data
    FROM auth.users
  LOOP
    -- Defekte/fehlende Identity löschen und neu anlegen
    DELETE FROM auth.identities WHERE user_id = rec.id AND provider = 'email';

    INSERT INTO auth.identities (
      id, user_id, identity_data,
      provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      rec.id, rec.id,
      jsonb_build_object(
        'sub', rec.id::text,
        'email', rec.email,
        'email_verified', true
      ),
      'email', rec.id::text,
      now(), now(), now()
    );

    -- raw_app_meta_data
    UPDATE auth.users SET
      raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb
    WHERE id = rec.id
      AND (raw_app_meta_data IS NULL OR raw_app_meta_data = '{}'::jsonb
           OR NOT (raw_app_meta_data ? 'provider'));

    -- raw_user_meta_data
    UPDATE auth.users SET
      raw_user_meta_data = jsonb_build_object(
        'sub', rec.id::text,
        'email', rec.email,
        'full_name', COALESCE(rec.raw_user_meta_data->>'full_name', ''),
        'email_verified', true,
        'phone_verified', false
      )
    WHERE id = rec.id
      AND (raw_user_meta_data IS NULL OR NOT (raw_user_meta_data ? 'sub'));

    -- encrypted_password darf nicht NULL sein
    UPDATE auth.users SET encrypted_password = ''
    WHERE id = rec.id AND (encrypted_password IS NULL OR encrypted_password = '');

    -- is_sso_user muss false sein
    UPDATE auth.users SET is_sso_user = false
    WHERE id = rec.id AND (is_sso_user IS NULL OR is_sso_user = true);

    v_fixed := v_fixed + 1;
    RAISE NOTICE 'Repariert: %', rec.email;
  END LOOP;

  RAISE NOTICE '% User repariert.', v_fixed;
END $$;

-- Prüfen: Alle User sollten genau 1 Identity haben
SELECT u.email, count(i.id) as identities
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id AND i.provider = 'email'
GROUP BY u.email
ORDER BY u.email;
