-- ============================================================
-- 006: Domain-Wechsel zu zukunftbauen.org
-- ============================================================
--
-- Aktualisiert den Nachmeldung-Email-Trigger:
--   - Absenderadresse: noreply@zukunftbauen.org
--   - Orga-Panel-Link: https://zukunftbauen.org/orga
--
-- WICHTIG: Auf Supabase SQL-Editor ausführen!
-- VORAUSSETZUNG: Domain zukunftbauen.org bei Resend verifiziert!
-- ============================================================

CREATE OR REPLACE FUNCTION public.notify_nachmeldung()
RETURNS TRIGGER AS $fn$
DECLARE
  email_body text;
  resend_key text;
BEGIN
  -- API key from Supabase Vault
  SELECT decrypted_secret INTO resend_key
    FROM vault.decrypted_secrets WHERE name = 'resend_api_key';

  IF resend_key IS NULL OR resend_key = '' THEN
    RAISE WARNING '[notify_nachmeldung] Resend API Key nicht im Vault (name=resend_api_key). Keine Email für Nachmeldung ID=%, Name=%', NEW.id, NEW.name;
    RETURN NEW;
  END IF;

  -- User-Input escapen bevor es in HTML eingebettet wird
  email_body := '<h2>Neue Nachmeldung eingegangen</h2>'
    || '<p><strong>Name:</strong> ' || escape_html(NEW.name) || '</p>'
    || '<p><strong>E-Mail:</strong> ' || escape_html(NEW.email) || '</p>'
    || CASE
         WHEN NEW.comment IS NOT NULL AND NEW.comment != ''
         THEN '<p><strong>Kommentar:</strong> ' || escape_html(NEW.comment) || '</p>'
         ELSE ''
       END
    || '<p><strong>Zeitpunkt:</strong> ' || to_char(NEW.created_at, 'DD.MM.YYYY HH24:MI') || '</p>'
    || '<hr><p>Bitte im <a href="https://zukunftbauen.org/orga">Orga-Panel</a> genehmigen oder ablehnen.</p>';

  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Zukunft bauen <noreply@zukunftbauen.org>',
      'to', 'christoph.goebel@haw-kiel.de',
      'subject', 'Neue Nachmeldung: ' || escape_html(NEW.name),
      'html', email_body
    )
  );

  RAISE LOG '[notify_nachmeldung] Email gesendet für Nachmeldung ID=%, Name=%', NEW.id, NEW.name;
  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[notify_nachmeldung] Fehler: % (SQLSTATE: %) für ID=%', SQLERRM, SQLSTATE, NEW.id;
  RETURN NEW;
END;
$fn$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger neu anlegen (idempotent)
DROP TRIGGER IF EXISTS on_nachmeldung_insert ON nachmeldung_requests;
CREATE TRIGGER on_nachmeldung_insert
  AFTER INSERT ON nachmeldung_requests
  FOR EACH ROW EXECUTE FUNCTION notify_nachmeldung();
