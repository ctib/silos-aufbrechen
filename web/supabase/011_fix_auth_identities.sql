-- ============================================================
-- 011: Fix für manuell importierte auth.users
-- ============================================================
-- WICHTIG: Auf Supabase SQL-Editor ausführen!
--
-- Problem: Manuell in auth.users eingefügte User (z.B. via
-- import.sql oder 008_add_orga_tn.sql) verursachen
-- "Database error finding user" bei signInWithOtp.
--
-- Ursache: GoTrue erwartet Einträge in auth.identities,
-- korrekte raw_app_meta_data, raw_user_meta_data und
-- encrypted_password. Manuelle INSERTs setzen diese nicht.
--
-- EMPFEHLUNG: Neue User NICHT per INSERT in auth.users anlegen,
-- sondern über das Supabase Dashboard (Authentication > Users >
-- Add user > Auto Confirm). Danach Profil + Rolle per SQL setzen.
-- ============================================================

-- 1. Fehlende Identities nachträglich erstellen
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
SELECT
  u.id, u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email', u.id::text, now(), u.created_at, now()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities i WHERE i.user_id = u.id AND i.provider = 'email'
);

-- 2. raw_app_meta_data setzen (Provider-Info für GoTrue)
UPDATE auth.users SET
  raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb
WHERE raw_app_meta_data IS NULL OR raw_app_meta_data = '{}'::jsonb;

-- 3. raw_user_meta_data um fehlende Felder ergänzen
UPDATE auth.users SET
  raw_user_meta_data = jsonb_build_object(
    'sub', id::text,
    'email', email,
    'full_name', COALESCE(raw_user_meta_data->>'full_name', ''),
    'email_verified', true,
    'phone_verified', false
  )
WHERE raw_user_meta_data IS NULL
   OR NOT (raw_user_meta_data ? 'sub');

-- 4. encrypted_password darf nicht NULL sein
UPDATE auth.users SET encrypted_password = ''
WHERE encrypted_password IS NULL;

-- HINWEIS: Falls signInWithOtp danach immer noch fehlschlägt,
-- User über Dashboard löschen und neu anlegen (Add user > Auto Confirm),
-- dann Profil/Rolle per SQL setzen. Das war bei Meike + Tammo nötig.
