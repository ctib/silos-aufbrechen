-- Migration 023: Auto-create registration when Nachmeldung is approved
-- Problem: Between approval and magic-link click, the person has a profile but no registration.
-- Solution: RPC function that creates a registration immediately after approval.

CREATE OR REPLACE FUNCTION public.create_registration_for_email(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_id uuid;
  v_existing_reg_id uuid;
BEGIN
  IF NOT is_orga() THEN
    RAISE EXCEPTION 'Nur Orga/Admin dürfen diese Funktion aufrufen';
  END IF;

  SELECT id INTO v_profile_id FROM profiles WHERE email = p_email;
  IF v_profile_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT id INTO v_existing_reg_id FROM registrations WHERE profile_id = v_profile_id;
  IF v_existing_reg_id IS NOT NULL THEN
    RETURN false;
  END IF;

  INSERT INTO registrations (profile_id, attends_lecture, attends_workshop, attends_dinner, source)
  VALUES (v_profile_id, true, true, false, 'nachmeldung');

  RETURN true;
END;
$$;
