-- RPC-Funktion: Prüft ob eine Email in der profiles-Tabelle existiert.
-- Wird vom Login-Flow im internen Bereich aufgerufen (vor Auth, daher SECURITY DEFINER).
-- Gibt nur true/false zurück, keine weiteren Daten – kein Datenschutzrisiko.

CREATE OR REPLACE FUNCTION public.check_email_registered(check_email text)
RETURNS boolean AS $$
  SELECT EXISTS(SELECT 1 FROM profiles WHERE email = lower(check_email));
$$ LANGUAGE sql SECURITY DEFINER;
