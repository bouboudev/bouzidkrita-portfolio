#!/usr/bin/env node
/**
 * Rapport analytics hebdomadaire — portfolio Astro + Umami Cloud (Share URL).
 *
 * - Node 20+, fetch natif, aucune dépendance npm.
 * - N'utilise PAS l'API Pro : uniquement les endpoints publics du dashboard
 *   partagé via x-umami-share-token.
 * - Période : 7 derniers jours (startAt = now - 7j, endAt = now, en ms).
 *
 * Variables d'environnement obligatoires :
 *   UMAMI_SHARE_TOKEN, UMAMI_WEBSITE_ID,
 *   RESEND_API_KEY, REPORT_EMAIL, REPORT_FROM_EMAIL
 * Optionnelle :
 *   UMAMI_GATEWAY_URL (défaut : https://gateway-eu.umami.is)
 */

const REQUIRED_ENV = [
  'UMAMI_SHARE_TOKEN',
  'UMAMI_WEBSITE_ID',
  'RESEND_API_KEY',
  'REPORT_EMAIL',
  'REPORT_FROM_EMAIL',
];

const env = process.env;
const GATEWAY = (env.UMAMI_GATEWAY_URL || 'https://gateway-eu.umami.is').replace(/\/+$/, '');
const SHARE_TOKEN = env.UMAMI_SHARE_TOKEN || '';
const WEBSITE_ID = env.UMAMI_WEBSITE_ID || '';
const RESEND_API_KEY = env.RESEND_API_KEY || '';
const REPORT_EMAIL = env.REPORT_EMAIL || '';
const REPORT_FROM_EMAIL = env.REPORT_FROM_EMAIL || '';

// ---------------------------------------------------------------------------
// Validation démarrage (sans jamais logger la valeur des secrets)
// ---------------------------------------------------------------------------
const missing = REQUIRED_ENV.filter((k) => !env[k] || String(env[k]).trim() === '');
if (missing.length > 0) {
  console.error(`Variables d'environnement manquantes : ${missing.join(', ')}`);
  console.error(
    'Configurez UMAMI_SHARE_TOKEN, UMAMI_WEBSITE_ID, RESEND_API_KEY, REPORT_EMAIL, REPORT_FROM_EMAIL.',
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Extrait une valeur numérique d'un nœud stats Umami ({ value } ou nombre brut). */
function statValue(node) {
  if (typeof node === 'number') return toNumber(node, 0);
  if (node && typeof node === 'object') {
    if (typeof node.value === 'number') return toNumber(node.value, 0);
    if (typeof node.current === 'number') return toNumber(node.current, 0);
  }
  return 0;
}

/** Normalise une réponse /metrics qui peut être un array ou un objet enveloppe. */
function toMetricsArray(json) {
  if (Array.isArray(json)) return json;
  if (json && typeof json === 'object') {
    for (const key of ['data', 'metrics', 'items', 'results']) {
      if (Array.isArray(json[key])) return json[key];
    }
  }
  return [];
}

function metricLabel(item) {
  if (!item || typeof item !== 'object') return '';
  const raw = item.x ?? item.label ?? item.name ?? item.key;
  if (raw === null || raw === undefined) return '';
  return String(raw);
}

function metricCount(item) {
  if (!item || typeof item !== 'object') return 0;
  return toNumber(item.y ?? item.count ?? item.total ?? item.value ?? 0, 0);
}

function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(toNumber(totalSeconds, 0)));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (s < 3600) return rest === 0 ? `${m} min` : `${m} min ${rest} s`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm === 0 ? `${h} h` : `${h} h ${mm} min`;
}

function formatBounceRate(bounces, visits) {
  if (!(visits > 0)) return 'n/a';
  return `${((bounces / visits) * 100).toFixed(1)} %`;
}

// ---------------------------------------------------------------------------
// Client Umami (Share URL, sans cookie / session / API key Pro)
// ---------------------------------------------------------------------------
async function fetchUmami(path) {
  const url = `${GATEWAY}/api/websites/${WEBSITE_ID}${path}`;
  let res;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-umami-share-context': '1',
        'x-umami-share-token': SHARE_TOKEN,
      },
    });
  } catch (err) {
    throw new Error(`Échec réseau vers Umami (${err?.message || err})`);
  }

  if (res.status === 401) {
    const err = new Error('UMAMI_UNAUTHORIZED');
    err.code = 'UMAMI_UNAUTHORIZED';
    throw err;
  }

  if (!res.ok) {
    let snippet = '';
    try {
      snippet = (await res.text()).slice(0, 300);
    } catch {
      snippet = '';
    }
    throw new Error(`Umami a répondu ${res.status}${snippet ? ` : ${snippet}` : ''}`);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

function handleUmamiAuthError() {
  console.error('Umami share token invalide ou expiré.');
  console.error('Ouvrez le Share URL Umami et récupérez un nouveau x-umami-share-token.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const endAt = Date.now();
  const startAt = endAt - 7 * 24 * 60 * 60 * 1000;
  const qs = `startAt=${startAt}&endAt=${endAt}`;

  let statsJson;
  let pathJson;
  let referrerJson;
  let eventJson;
  try {
    [statsJson, pathJson, referrerJson, eventJson] = await Promise.all([
      fetchUmami(`/stats?${qs}`),
      fetchUmami(`/metrics?${qs}&type=path&limit=10`),
      fetchUmami(`/metrics?${qs}&type=referrer&limit=10`),
      fetchUmami(`/metrics?${qs}&type=event&limit=50`),
    ]);
  } catch (err) {
    if (err?.code === 'UMAMI_UNAUTHORIZED') handleUmamiAuthError();
    throw err;
  }

  // --- Trafic (robuste aux variantes de structure) ---
  const stats = statsJson && typeof statsJson === 'object' ? statsJson : {};
  const visitors = statValue(stats.visitors);
  const visits = statValue(stats.visits);
  const pageviews = statValue(stats.pageviews);
  const bounces = statValue(stats.bounces);
  const totalTime = statValue(stats.totaltime ?? stats.totalTime ?? stats.time);
  const bounceRate = formatBounceRate(bounces, visits);
  const avgPerVisit = visits > 0 ? formatDuration(totalTime / visits) : 'n/a';

  // --- Interactions ---
  const eventRows = toMetricsArray(eventJson);
  const eventMap = new Map();
  for (const item of eventRows) {
    if (!item || typeof item !== 'object') continue;
    eventMap.set(metricLabel(item), metricCount(item));
  }
  const interactions = {
    'github-click': toNumber(eventMap.get('github-click') ?? 0, 0),
    'linkedin-click': toNumber(eventMap.get('linkedin-click') ?? 0, 0),
    'contact-click': toNumber(eventMap.get('contact-click') ?? 0, 0),
    'contact-submit': toNumber(eventMap.get('contact-submit') ?? 0, 0),
    'contact-success': toNumber(eventMap.get('contact-success') ?? 0, 0),
  };

  // --- Top pages / Sources (ne casse pas si vide) ---
  const topPages = toMetricsArray(pathJson)
    .filter((i) => i && typeof i === 'object')
    .map((i) => ({ label: metricLabel(i) || '(sans titre)', count: metricCount(i) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topReferrers = toMetricsArray(referrerJson)
    .filter((i) => i && typeof i === 'object')
    .map((i) => {
      const raw = metricLabel(i).trim();
      return { label: raw === '' ? 'Direct' : raw, count: metricCount(i) };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // --- Période en français ---
  const dayMonth = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' });
  const period = `${dayMonth.format(new Date(startAt))} → ${dayMonth.format(new Date(endAt))}`;

  // --- Rapport texte (logs, sans secrets) ---
  const lines = [
    '📊 Rapport hebdo bouzidkrita.com',
    `Période : ${period}`,
    '',
    'Trafic',
    `- visiteurs : ${visitors}`,
    `- visites : ${visits}`,
    `- pages vues : ${pageviews}`,
    `- taux de rebond : ${bounceRate}`,
    `- durée totale : ${formatDuration(totalTime)}`,
    `- durée moyenne / visite : ${avgPerVisit}`,
    '',
    'Interactions',
    `- github-click : ${interactions['github-click']}`,
    `- linkedin-click : ${interactions['linkedin-click']}`,
    `- contact-click : ${interactions['contact-click']}`,
    `- contact-submit : ${interactions['contact-submit']}`,
    `- contact-success : ${interactions['contact-success']}`,
    '',
    'Top pages',
    ...(topPages.length === 0
      ? ['(aucune donnée)']
      : topPages.map((p, i) => `${i + 1}. ${p.label} — ${p.count}`)),
    '',
    'Sources',
    ...(topReferrers.length === 0
      ? ['(aucune donnée)']
      : topReferrers.map((r, i) => `${i + 1}. ${r.label} — ${r.count}`)),
  ];
  console.log(lines.join('\n'));

  // --- Email HTML ---
  const row = (label, value) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(label)}</td>` +
    `<td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">${escapeHtml(String(value))}</td></tr>`;

  const listRows = (items) =>
    items.length === 0
      ? '<p style="color:#666;">Aucune donnée cette semaine.</p>'
      : `<ol style="margin:0;padding-left:20px;">${items
          .map(
            (it) =>
              `<li style="margin:4px 0;">${escapeHtml(it.label)} — <strong>${escapeHtml(String(it.count))}</strong></li>`,
          )
          .join('')}</ol>`;

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f6f6f6;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#222;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">
<div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.06);">
<h1 style="margin:0 0 4px;font-size:22px;">📊 Rapport hebdomadaire</h1>
<p style="margin:0 0 16px;color:#666;">bouzidkrita.com<br>Période : ${escapeHtml(period)}</p>
<h2 style="font-size:16px;margin:20px 0 8px;">Trafic</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
${row('Visiteurs', visitors)}
${row('Visites', visits)}
${row('Pages vues', pageviews)}
${row('Taux de rebond', bounceRate)}
${row('Durée totale', formatDuration(totalTime))}
${row('Durée moyenne / visite', avgPerVisit)}
</table>
<h2 style="font-size:16px;margin:20px 0 8px;">Interactions</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
${row('GitHub', interactions['github-click'])}
${row('LinkedIn', interactions['linkedin-click'])}
${row('Contact', interactions['contact-click'])}
${row('Formulaire envoyé', interactions['contact-submit'])}
${row('Contact réussi', interactions['contact-success'])}
</table>
<h2 style="font-size:16px;margin:20px 0 8px;">Top pages</h2>
${listRows(topPages)}
<h2 style="font-size:16px;margin:20px 0 8px;">Sources</h2>
${listRows(topReferrers)}
<p style="margin:20px 0 0;color:#888;font-size:12px;">Rapport généré automatiquement depuis Umami.</p>
</div></div></body></html>`;

  // --- Envoi Resend ---
  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: REPORT_FROM_EMAIL,
        to: [REPORT_EMAIL],
        subject: '📊 Rapport hebdo bouzidkrita.com',
        html,
      }),
    });
  } catch (err) {
    console.error(`Échec réseau vers Resend (${err?.message || err})`);
    process.exit(1);
  }

  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.text()).slice(0, 500);
    } catch {
      detail = '';
    }
    console.error(`Resend a renvoyé une erreur (status ${res.status}).`);
    if (detail) console.error(`Détail : ${detail}`);
    console.error('Vérifiez RESEND_API_KEY, REPORT_FROM_EMAIL (expéditeur validé) et REPORT_EMAIL.');
    process.exit(1);
  }

  console.log('Rapport envoyé par email avec succès.');
}

main().catch((err) => {
  if (err?.code === 'UMAMI_UNAUTHORIZED') handleUmamiAuthError();
  console.error(`Erreur : ${err?.message || err}`);
  process.exit(1);
});
