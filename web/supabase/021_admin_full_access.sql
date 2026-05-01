-- Migration 021: Admin bekommt gleiche RLS-Rechte wie Orga
-- Bisher nutzen viele Policies is_orga(), das schliesst admin aus.
-- Fix: is_orga() aendern, damit admin UND orga enthalten sind.

-- Einfachster Fix: is_orga() erweitern statt alle Policies einzeln anzufassen
CREATE OR REPLACE FUNCTION public.is_orga()
RETURNS boolean AS $$
  SELECT current_user_role() IN ('admin', 'orga');
$$ LANGUAGE sql SECURITY DEFINER STABLE;
