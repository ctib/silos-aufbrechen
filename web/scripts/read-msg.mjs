#!/usr/bin/env node
/**
 * read-msg.mjs – liest Outlook-.msg-Dateien ohne Outlook und ohne Abhängigkeiten.
 *
 * .msg ist ein OLE2/CFB-Compound-File. Dieses Skript parst Header, FAT, MiniFAT
 * und Directory selbst und gibt Betreff, Absender und Textkörper aus. Optional
 * werden Anhänge (z. B. Einladungs-PDFs) herausgeschrieben.
 *
 * Verwendung:
 *   node web/scripts/read-msg.mjs "Veranstaltungen/Einladung.msg"
 *   node web/scripts/read-msg.mjs --attachments <Zielordner> "Veranstaltungen/*.msg"
 *
 * Hintergrund: Der Workflow "Veranstaltungen updaten" (siehe CLAUDE.md) bekommt
 * neue Termine als E-Mail in den Ordner Veranstaltungen/ gelegt.
 */

import fs from 'node:fs';
import path from 'node:path';

function parseCFB(buf) {
  if (buf.length < 512 || buf.readUInt32BE(0) !== 0xd0cf11e0) {
    throw new Error('Keine gültige .msg-/CFB-Datei');
  }

  const sectorSize = 1 << buf.readUInt16LE(30);
  const miniSize = 1 << buf.readUInt16LE(32);
  const numFatSectors = buf.readUInt32LE(44);
  const dirStart = buf.readUInt32LE(48);
  const miniCutoff = buf.readUInt32LE(56);
  const miniFatStart = buf.readUInt32LE(60);
  const numMiniFat = buf.readUInt32LE(64);
  const difatStart = buf.readUInt32LE(68);
  const numDifat = buf.readUInt32LE(72);

  const FREESECT = 0xffffffff;
  const ENDOFCHAIN = 0xfffffffe;
  const off = (s) => (s + 1) * sectorSize;

  // DIFAT: erste 109 Einträge im Header, Rest in verketteten Sektoren
  const difat = [];
  for (let i = 0; i < 109; i++) {
    const v = buf.readUInt32LE(76 + i * 4);
    if (v === FREESECT) break;
    difat.push(v);
  }
  let ds = difatStart;
  for (let k = 0; k < numDifat && ds !== FREESECT && ds !== ENDOFCHAIN; k++) {
    const base = off(ds);
    const n = sectorSize / 4 - 1;
    for (let i = 0; i < n; i++) {
      const v = buf.readUInt32LE(base + i * 4);
      if (v !== FREESECT) difat.push(v);
    }
    ds = buf.readUInt32LE(base + n * 4);
  }

  const fat = [];
  for (const sector of difat.slice(0, numFatSectors || difat.length)) {
    const base = off(sector);
    for (let i = 0; i < sectorSize / 4; i++) fat.push(buf.readUInt32LE(base + i * 4));
  }

  function chain(start, table) {
    const out = [];
    let s = start;
    let guard = 0;
    while (s !== ENDOFCHAIN && s !== FREESECT && s < table.length && guard++ < 1e6) {
      out.push(s);
      s = table[s];
    }
    return out;
  }

  function readChain(start, size) {
    const parts = chain(start, fat).map((s) => buf.subarray(off(s), off(s) + sectorSize));
    const joined = Buffer.concat(parts);
    return size === undefined ? joined : joined.subarray(0, size);
  }

  const miniFat = [];
  if (numMiniFat > 0) {
    const mf = readChain(miniFatStart);
    for (let i = 0; i < mf.length / 4; i++) miniFat.push(mf.readUInt32LE(i * 4));
  }

  const dirBuf = readChain(dirStart);
  const entries = [];
  for (let i = 0; i < dirBuf.length / 128; i++) {
    const b = dirBuf.subarray(i * 128, i * 128 + 128);
    const nameLen = b.readUInt16LE(64);
    if (nameLen < 2) continue;
    entries.push({
      name: b.subarray(0, nameLen - 2).toString('utf16le'),
      type: b.readUInt8(66),
      start: b.readUInt32LE(116),
      size: Number(b.readBigUInt64LE(120)),
    });
  }

  const root = entries.find((e) => e.type === 5);
  const miniStream = root && root.size ? readChain(root.start, root.size) : Buffer.alloc(0);

  function readStream(e) {
    if (e.size < miniCutoff) {
      const parts = chain(e.start, miniFat).map((s) =>
        miniStream.subarray(s * miniSize, s * miniSize + miniSize)
      );
      return Buffer.concat(parts).subarray(0, e.size);
    }
    return readChain(e.start, e.size);
  }

  return { entries, readStream };
}

/** MAPI-Property-Tags, die für Veranstaltungs-Mails interessant sind. */
const PROPS = {
  '0037': 'Betreff',
  '0C1A': 'Von',
  '0C1F': 'Von (E-Mail)',
  '0E04': 'An',
  '1000': 'Text',
};

function decode(raw, type) {
  if (type === '001F') return raw.toString('utf16le');
  if (type === '001E') return raw.toString('latin1');
  return null;
}

function readMsg(file, attachmentDir) {
  const { entries, readStream } = parseCFB(fs.readFileSync(file));

  console.log('='.repeat(78));
  console.log(path.basename(file));
  console.log('='.repeat(78));

  const found = new Map();
  for (const e of entries) {
    const m = /^__substg1\.0_([0-9A-F]{4})([0-9A-F]{4})$/.exec(e.name);
    if (!m) continue;
    const [, tag, type] = m;
    if (!PROPS[tag] || found.has(tag)) continue;
    const value = decode(readStream(e), type);
    if (value === null) continue;
    found.set(tag, value.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim());
  }

  for (const [tag, label] of Object.entries(PROPS)) {
    if (found.has(tag)) console.log(`\n--- ${label} ---\n${found.get(tag)}`);
  }

  if (!attachmentDir) return;

  // Anhangsnamen (3707 = langer Dateiname) und Inhalte (3701 = Binary) einsammeln
  const names = entries
    .filter((e) => /^__substg1\.0_3707001F$/.test(e.name))
    .map((e) => readStream(e).toString('utf16le'));
  const blobs = entries.filter((e) => /^__substg1\.0_37010102$/.test(e.name));

  fs.mkdirSync(attachmentDir, { recursive: true });
  blobs.forEach((e, i) => {
    const name = names[i] || `anhang_${i}.bin`;
    const target = path.join(attachmentDir, name.replace(/[/\\:*?"<>|]/g, '_'));
    fs.writeFileSync(target, readStream(e));
    console.log(`\n[Anhang gespeichert] ${target}`);
  });
}

const args = process.argv.slice(2);
let attachmentDir = null;
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--attachments') attachmentDir = args[++i];
  else files.push(args[i]);
}

if (files.length === 0) {
  console.error('Verwendung: node read-msg.mjs [--attachments <ordner>] <datei.msg> ...');
  process.exit(1);
}

for (const file of files) {
  try {
    readMsg(file, attachmentDir);
  } catch (err) {
    console.error(`\n[Fehler] ${file}: ${err.message}`);
  }
}
