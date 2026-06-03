import type { APIRoute } from 'astro';
import { events } from '../data/events';

function toIcsDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export const GET: APIRoute = () => {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//zukunftbauen.org//Veranstaltungskalender//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Zukunft bauen – Veranstaltungen',
  ];

  for (const event of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@zukunftbauen.org`,
      `DTSTART:${toIcsDate(event.start)}`,
      `DTEND:${toIcsDate(event.end)}`,
      `SUMMARY:${escapeIcs(event.title)}`,
      `DESCRIPTION:${escapeIcs(event.description)}`,
    );
    if (event.location) lines.push(`LOCATION:${escapeIcs(event.location)}`);
    if (event.url) lines.push(`URL:${event.url}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  const body = lines.join('\r\n') + '\r\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
    },
  });
};
