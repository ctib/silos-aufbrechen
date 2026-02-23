# Domain-Setup: zukunftbauen.org

Domain registriert bei **Namecheap**, DNS verwaltet ueber **Cloudflare**.

## 1. Domain registriert (erledigt)

- Domain: `zukunftbauen.org`
- Registrar: Namecheap
- Cloudflare als DNS-Provider (Nameserver bei Namecheap umgestellt)

## 2. DNS fuer GitHub Pages (Cloudflare)

In Cloudflare Dashboard > zukunftbauen.org > **DNS** > **Records**:

| Typ   | Name | Inhalt            | Proxy       | TTL  |
|-------|------|-------------------|-------------|------|
| A     | @    | 185.199.108.153   | Aus (grau)  | Auto |
| A     | @    | 185.199.109.153   | Aus (grau)  | Auto |
| A     | @    | 185.199.110.153   | Aus (grau)  | Auto |
| A     | @    | 185.199.111.153   | Aus (grau)  | Auto |
| CNAME | www  | ctib.github.io    | Aus (grau)  | Auto |

> **Wichtig:** Proxy (oranges Woelkchen) muss **aus** sein (grau/DNS only), damit GitHub das SSL-Zertifikat ausstellen kann.

## 3. GitHub Pages Custom Domain

1. GitHub Repo > **Settings** > **Pages**
2. Unter **Custom domain**: `zukunftbauen.org` eintragen > **Save**
3. Warten bis DNS-Check gruen wird
4. **Enforce HTTPS** aktivieren

> CNAME-Datei liegt bereits im Build (`web/public/CNAME`).

## 4. Supabase Redirect URLs

1. [Supabase Dashboard](https://supabase.com/dashboard/project/cbybfmnbojklqbkmuwto) > **Authentication** > **URL Configuration**
2. **Site URL** aendern auf: `https://zukunftbauen.org/`
3. Unter **Redirect URLs** hinzufuegen:
   - `https://zukunftbauen.org/**`
   - `https://www.zukunftbauen.org/**`
4. Alte GitHub-Pages-URLs (`https://ctib.github.io/silos-aufbrechen/**`) vorerst drin lassen als Fallback

## 5. Resend: Domain verifizieren

1. [resend.com/domains](https://resend.com/domains) > **Add Domain** > `zukunftbauen.org`
2. Resend zeigt DNS-Records an. Diese in Cloudflare DNS eintragen (Proxy **aus**):
   - 1x **MX**-Record (Bounce-Handling)
   - 1-2x **TXT**-Records (SPF + DKIM)
   - 1x **CNAME**-Record (DKIM)
3. Zurueck in Resend: **Verify** klicken
4. Nach Verifizierung: Emails an *beliebige* Empfaenger moeglich
5. Absenderadresse: `noreply@zukunftbauen.org`

> SQL-Migration `006_domain_switch.sql` auf Supabase SQL-Editor ausfuehren, sobald Resend verifiziert ist.

## 6. Code-Anpassungen (erledigt)

- [x] `astro.config.mjs`: `site: 'https://zukunftbauen.org'`, kein `base` mehr
- [x] `web/public/CNAME`: `zukunftbauen.org`
- [x] `noindex` Meta-Tag entfernt (Seite wird indexiert)
- [x] SQL-Trigger: Absender `noreply@zukunftbauen.org`, Link `https://zukunftbauen.org/orga`
- [x] SQL-Migration `006_domain_switch.sql` erstellt

## Checkliste

- [x] Domain registriert (Namecheap)
- [ ] Nameserver bei Namecheap auf Cloudflare umgestellt
- [ ] DNS-Records fuer GitHub Pages in Cloudflare gesetzt
- [ ] Custom Domain in GitHub Pages aktiviert + HTTPS erzwungen
- [ ] Supabase Redirect URLs angepasst
- [ ] Resend Domain verifiziert + DNS-Records gesetzt
- [ ] `006_domain_switch.sql` auf Supabase ausgefuehrt
