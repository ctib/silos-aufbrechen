-- Email notification trigger for nachmeldung requests
-- Uses pg_net + Resend API to send email to Christoph
--
-- Voraussetzungen:
--   1. pg_net Extension muss aktiviert sein (Supabase Dashboard → Database → Extensions)
--   2. Resend API Key muss im Vault liegen:
--      SELECT vault.create_secret('re_xxxxx', 'resend_api_key');
--   3. Empfänger muss bei Resend verifiziert sein (solange onboarding@resend.dev als Absender)
--      ODER eigene Domain bei Resend verifiziert

CREATE OR REPLACE FUNCTION public.notify_nachmeldung()
RETURNS TRIGGER AS $fn$
DECLARE
  request_id bigint;
  email_body text;
  resend_key text;
BEGIN
  -- API key from Supabase Vault (never hardcode!)
  SELECT decrypted_secret INTO resend_key
    FROM vault.decrypted_secrets WHERE name = 'resend_api_key';

  -- Guard: API key missing
  IF resend_key IS NULL OR resend_key = '' THEN
    RAISE WARNING '[notify_nachmeldung] Resend API Key nicht im Vault gefunden (name=resend_api_key). Email wird nicht gesendet für Nachmeldung von: %', NEW.name;
    RETURN NEW;
  END IF;

  email_body := '<h2>Neue Nachmeldung eingegangen</h2>'
    || '<p><strong>Name:</strong> ' || NEW.name || '</p>'
    || '<p><strong>E-Mail:</strong> ' || NEW.email || '</p>'
    || CASE WHEN NEW.comment IS NOT NULL AND NEW.comment != '' THEN '<p><strong>Kommentar:</strong> ' || NEW.comment || '</p>' ELSE '' END
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
      'subject', 'Neue Nachmeldung: ' || NEW.name,
      'html', email_body
    )
  );

  RAISE LOG '[notify_nachmeldung] Email-Versand ausgelöst für Nachmeldung von: %', NEW.name;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[notify_nachmeldung] Fehler beim Email-Versand: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$fn$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_nachmeldung_insert ON nachmeldung_requests;
CREATE TRIGGER on_nachmeldung_insert
  AFTER INSERT ON nachmeldung_requests
  FOR EACH ROW EXECUTE FUNCTION notify_nachmeldung();
