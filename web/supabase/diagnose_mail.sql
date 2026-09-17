-- ============================================================
-- Diagnose: Warum kommt keine E-Mail an?
-- ============================================================
-- Im Supabase SQL-Editor Block für Block ausführen und die Ausgabe
-- ansehen. Die Mail-Trigger fangen Fehler bewusst ab (damit eine
-- Anmeldung nie an einer Mail scheitert) – deshalb sieht man den
-- eigentlichen Fehler nur hier.
-- ============================================================


-- 1. Liegt der Resend-Key im Vault und heißt er exakt 'resend_api_key'?
--    Erwartung: eine Zeile, key_vorhanden = true
select name,
       (decrypted_secret is not null and decrypted_secret <> '') as key_vorhanden,
       length(decrypted_secret) as key_laenge
  from vault.decrypted_secrets
 where name = 'resend_api_key';


-- 2. Ist die Anmeldung überhaupt angekommen?
select id, full_name, email, status, is_internal, created_at
  from ifb_fest_registrations
 order by created_at desc
 limit 10;


-- 3. Was hat pg_net an Resend geschickt – und was kam zurück?
--    status_code 200/202 = Resend hat angenommen.
--    401 = falscher Key, 403 = Domain nicht verifiziert,
--    422 = Empfänger/Absender abgelehnt.
select r.id,
       r.status_code,
       r.error_msg,
       left(r.content, 500) as antwort,
       r.created           as zeitpunkt
  from net._http_response r
 order by r.created desc
 limit 20;


-- 4. Laufen noch Requests in der Warteschlange fest?
select count(*) as offene_requests from net.http_request_queue;


-- 5. Sind beide Trigger aktiv?
--    Erwartung: on_ifb_fest_registration_insert + on_ifb_fest_registration_confirm
select tgname as trigger_name,
       tgenabled as aktiv
  from pg_trigger
 where tgrelid = 'ifb_fest_registrations'::regclass
   and not tgisinternal;


-- 6. Testmail direkt auslösen (Adresse anpassen!).
--    Danach Block 3 erneut ausführen und status_code prüfen.
--    Wenn hier 200 kommt, aber bei der Anmeldung nichts passiert,
--    liegt es am Trigger – nicht an Resend.
/*
select net.http_post(
  url := 'https://api.resend.com/emails',
  headers := jsonb_build_object(
    'Authorization', 'Bearer ' || (select decrypted_secret
                                     from vault.decrypted_secrets
                                    where name = 'resend_api_key'),
    'Content-Type', 'application/json'
  ),
  body := jsonb_build_object(
    'from', 'Zukunft bauen <noreply@zukunftbauen.org>',
    'to', 'HIER.EIGENE@ADRESSE.de',
    'subject', 'Testmail aus Supabase',
    'html', '<p>Wenn diese Mail ankommt, funktioniert der Resend-Weg.</p>'
  )
);
*/
