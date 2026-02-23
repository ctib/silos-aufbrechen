# Domain-Setup auf Cloudflare

Anleitung fuer die Registrierung einer eigenen Domain und Konfiguration fuer GitHub Pages, Supabase und Resend.

## 1. Domain bei Cloudflare registrieren

1. Einloggen auf [dash.cloudflare.com](https://dash.cloudflare.com)
2. Links: **Domain Registration** > **Register Domains**
3. Wunschdomain suchen (z.B. `silos-aufbrechen.de`, `zukunft-bauen.de`, o.ae.)
4. Domain in den Warenkorb, Kontaktdaten ausfuellen, bezahlen
5. Cloudflare wird automatisch als DNS-Provider eingerichtet

> **Tipp:** `.de`-Domains kosten bei Cloudflare ca. 10 EUR/Jahr. Alternativ `.org`, `.net` oder `.events`.

## 2. DNS fuer GitHub Pages einrichten

In Cloudflare Dashboard > die neue Domain > **DNS** > **Records**:

| Typ   | Name | Inhalt                      | Proxy | TTL  |
|-------|------|-----------------------------|-------|------|
| CNAME | www  | ctib.github.io              | Aus   | Auto |
| CNAME | @    | ctib.github.io              | Aus   | Auto |

> **Wichtig:** Proxy (oranges Woelkchen) muss **aus** sein (grau/DNS only), damit GitHub das SSL-Zertifikat ausstellen kann.

Falls Cloudflare kein CNAME auf `@` (Root) erlaubt, stattdessen 4x A-Records:

| Typ | Name | Inhalt           |
|-----|------|------------------|
| A   | @    | 185.199.108.153  |
| A   | @    | 185.199.109.153  |
| A   | @    | 185.199.110.153  |
| A   | @    | 185.199.111.153  |

Plus den CNAME fuer `www` wie oben.

## 3. GitHub Pages Custom Domain aktivieren

1. GitHub Repo > **Settings** > **Pages**
2. Unter **Custom domain**: die neue Domain eintragen (z.B. `silos-aufbrechen.de`)
3. **Save** klicken
4. Warten bis der DNS-Check gruen wird (kann bis zu 24h dauern, meist Minuten)
5. **Enforce HTTPS** aktivieren (Checkbox erscheint nach erfolgreichem DNS-Check)

> GitHub legt automatisch eine `CNAME`-Datei im Repo an. Falls nicht: mir Bescheid geben, dann passe ich den Build an.

## 4. Supabase Redirect URLs anpassen

1. [Supabase Dashboard](https://supabase.com/dashboard/project/cbybfmnbojklqbkmuwto) > **Authentication** > **URL Configuration**
2. **Site URL** auf die neue Domain aendern: `https://silos-aufbrechen.de/`
3. Unter **Redirect URLs** hinzufuegen:
   - `https://silos-aufbrechen.de/**`
   - `https://www.silos-aufbrechen.de/**`
4. Die alten GitHub-Pages-URLs (`https://ctib.github.io/silos-aufbrechen/**`) vorerst drin lassen als Fallback

## 5. Resend: Eigene Domain verifizieren

Das ist der wichtigste Schritt fuer funktionierende Emails (Nachmeldung-Benachrichtigungen, Magic Links).

1. Einloggen auf [resend.com/domains](https://resend.com/domains)
2. **Add Domain** > Domain eingeben (z.B. `silos-aufbrechen.de`)
3. Resend zeigt DNS-Records an, die gesetzt werden muessen. Typischerweise:
   - 1x **MX**-Record (fuer Bounce-Handling)
   - 1-2x **TXT**-Records (SPF + DKIM)
   - 1x **CNAME**-Record (DKIM)
4. Diese Records in Cloudflare DNS eintragen (alle mit Proxy **aus**)
5. Zurueck in Resend: **Verify** klicken
6. Status wechselt auf "Verified" (kann Minuten dauern)

> Nach der Verifizierung koennen Emails an *beliebige* Empfaenger gesendet werden, nicht nur an verifizierte. Die Absenderadresse kann dann z.B. `noreply@silos-aufbrechen.de` sein.

## 6. Was ich dann im Code anpasse

Sobald Domain + Resend verifiziert sind, mir Bescheid geben. Ich kuemmere mich dann um:

- [ ] `astro.config.mjs`: `site` URL und `base` path anpassen (kein `/silos-aufbrechen/` Prefix mehr)
- [ ] `basePath()` und alle internen Links aktualisieren
- [ ] GitHub Actions Workflow: CNAME-Datei sicherstellen
- [ ] Supabase Email-Templates: Absender-Domain aktualisieren
- [ ] Nachmeldung-Trigger SQL: Absenderadresse auf neue Domain
- [ ] `noindex` Meta-Tag entfernen (Seite soll dann indexiert werden)
- [ ] Alte GitHub-Pages-URL per Redirect auf neue Domain weiterleiten

## Checkliste

- [ ] Domain registriert
- [ ] DNS-Records fuer GitHub Pages gesetzt
- [ ] Custom Domain in GitHub Pages aktiviert
- [ ] HTTPS erzwungen
- [ ] Supabase Redirect URLs angepasst
- [ ] Resend Domain verifiziert + DNS-Records gesetzt
- [ ] Mir Bescheid gegeben fuer Code-Anpassungen
