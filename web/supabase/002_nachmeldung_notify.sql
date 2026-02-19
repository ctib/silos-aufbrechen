-- Email notification trigger for nachmeldung requests
-- Uses pg_net + Resend API to send email to Christoph

CREATE OR REPLACE FUNCTION public.notify_nachmeldung()
RETURNS TRIGGER AS $fn$
DECLARE
  request_id bigint;
  email_body text;
BEGIN
  email_body := '<h2>Neue Nachmeldung eingegangen</h2>'
    || '<p><strong>Name:</strong> ' || NEW.name || '</p>'
    || '<p><strong>E-Mail:</strong> ' || NEW.email || '</p>'
    || CASE WHEN NEW.comment IS NOT NULL AND NEW.comment != '' THEN '<p><strong>Kommentar:</strong> ' || NEW.comment || '</p>' ELSE '' END
    || '<p><strong>Zeitpunkt:</strong> ' || to_char(NEW.created_at, 'DD.MM.YYYY HH24:MI') || '</p>'
    || '<hr><p>Bitte im <a href="https://ctib.github.io/silos-aufbrechen/orga">Orga-Panel</a> genehmigen oder ablehnen.</p>';

  SELECT net.http_post(
    url := 'https://api.resend.com/emails',
    headers := '{"Authorization": "XXX", "Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'from', 'Silos aufbrechen <onboarding@resend.dev>',
      'to', 'christoph.goebel@haw-kiel.de',
      'subject', 'Neue Nachmeldung: ' || NEW.name,
      'html', email_body
    )
  ) INTO request_id;

  RETURN NEW;
END;
$fn$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_nachmeldung_insert ON nachmeldung_requests;
CREATE TRIGGER on_nachmeldung_insert
  AFTER INSERT ON nachmeldung_requests
  FOR EACH ROW EXECUTE FUNCTION notify_nachmeldung();
