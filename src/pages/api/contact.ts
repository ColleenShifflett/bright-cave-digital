import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { FORMS, isFormType, type FormField } from '../../lib/forms';

// On-demand (serverless) route. The rest of the site is static; this endpoint
// runs on each request so it can verify Turnstile, rate-limit, and send email.
export const prerender = false;

// Verified Resend sender. The domain (brightcavedigital.com) must be verified
// in Resend for delivery to succeed.
const FROM_ADDRESS = 'Bright Cave Digital <colleen@brightcavedigital.com>';

// Contact-form interest that marks a submission as a waitlist request.
const INTEREST_WAITLIST = 'Freelance Work (Waitlist)';

// ---------------------------------------------------------------------------
// Rate limiting: max 5 submissions per IP per hour.
//
// This is an in-memory sliding window. On Vercel each serverless instance has
// its own memory, so this is best-effort (it resets on cold start and is not
// shared across instances). For hard guarantees, back this with a durable store
// such as Vercel KV / Upstash Redis. It is sufficient to blunt casual abuse.
// ---------------------------------------------------------------------------
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (hits.get(ip) ?? []).filter((t) => t > windowStart);

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map does not grow unbounded.
  if (hits.size > 10_000) {
    for (const [key, times] of hits) {
      const live = times.filter((t) => t > windowStart);
      if (live.length === 0) hits.delete(key);
      else hits.set(key, live);
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Cloudflare Turnstile server-side verification.
// ---------------------------------------------------------------------------
async function verifyTurnstile(token: string, ip: string, secret: string) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Lenient: accepts example.com or https://example.com/page.
const WEBSITE_RE = /^(https?:\/\/)?[^\s/]+\.[^\s]+$/i;

// Returns an error message for an invalid value, or null when it is fine.
function validateField(field: FormField, value: string): string | null {
  if (!value) return field.required ? 'Please fill in all required fields.' : null;
  if (value.length > 5000) return `${field.label} is too long.`;
  if (field.kind === 'email' && !EMAIL_RE.test(value)) {
    return 'Please enter a valid email address.';
  }
  if (field.kind === 'website' && (value.length > 300 || !WEBSITE_RE.test(value))) {
    return 'Please enter a valid website URL.';
  }
  if (field.kind === 'select' && !field.options?.includes(value)) {
    return `Please choose a valid option for "${field.label}".`;
  }
  return null;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const wantsJson = (request.headers.get('accept') || '').includes(
    'application/json',
  );

  // Success/failure responders that adapt to fetch (JSON) vs native form (303).
  const ok = () =>
    wantsJson
      ? new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      : new Response(null, { status: 303, headers: { Location: '/thank-you' } });

  // Resolved once the form is parsed; a no-JS failure returns to this page.
  let returnPath = FORMS.contact.returnPath;

  const fail = (status: number, error: string) =>
    wantsJson
      ? new Response(JSON.stringify({ ok: false, error }), {
          status,
          headers: { 'content-type': 'application/json' },
        })
      : new Response(null, {
          status: 303,
          headers: { Location: `${returnPath}?error=${encodeURIComponent(error)}` },
        });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, 'Invalid form submission.');
  }

  const get = (key: string) => (form.get(key) ?? '').toString().trim();

  // Older cached pages post without form_type, so it defaults to contact.
  const rawType = get('form_type') || 'contact';
  if (!isFormType(rawType)) {
    return fail(400, 'Invalid form submission.');
  }
  const definition = FORMS[rawType];
  returnPath = definition.returnPath;

  // 1. Honeypot: if the hidden field is filled, it's a bot. Pretend success so
  //    the bot gets no signal, but send nothing.
  if (get('company_url') !== '') {
    return ok();
  }

  // 2. Rate limit by IP.
  const ip =
    clientAddress ||
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown';
  if (isRateLimited(ip)) {
    return fail(429, 'Too many submissions. Please try again later.');
  }

  // 3. Validate fields against this form's definition.
  const values: Record<string, string> = {};
  for (const field of definition.fields) {
    const value = get(field.name);
    const error = validateField(field, value);
    if (error) return fail(400, error);
    values[field.name] = value;
  }
  const { name, email } = values;

  // 4. Verify Turnstile server-side.
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    return fail(500, 'Spam protection is not configured.');
  }
  const token = get('cf-turnstile-response');
  if (!token) {
    return fail(400, 'Please complete the verification challenge.');
  }
  const humanVerified = await verifyTurnstile(token, ip, turnstileSecret);
  if (!humanVerified) {
    return fail(400, 'Verification failed. Please try again.');
  }

  // 5. Send the notification email via Resend.
  const resendKey = import.meta.env.RESEND_API_KEY;
  const toAddress = import.meta.env.CONTACT_EMAIL;
  if (!resendKey || !toAddress) {
    return fail(500, 'Email delivery is not configured.');
  }

  const isWaitlist =
    rawType === 'waitlist' || values.interest === INTEREST_WAITLIST;
  const subjectValue = definition.subjectField ? values[definition.subjectField] : '';
  const subject = [definition.subjectLabel, subjectValue, name]
    .filter(Boolean)
    .join(': ');

  // Every submitted field, in form order, skipping empty optional ones.
  const rows = definition.fields
    .map((f) => ({ label: f.label, value: values[f.name], long: f.kind === 'textarea' }))
    .filter((r) => r.value);

  const textBody = [
    `Form: ${definition.subjectLabel}${isWaitlist ? '  (WAITLIST)' : ''}`,
    '',
    ...rows.map((r) => (r.long ? `${r.label}\n${r.value}\n` : `${r.label}: ${r.value}`)),
  ].join('\n');

  const htmlRows = rows
    .map((r) =>
      r.long
        ? `<p style="margin: 20px 0 4px; color:#6b7280;">${escapeHtml(r.label)}</p>
           <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(r.value)}</p>`
        : `<p style="margin: 0 0 6px;"><span style="color:#6b7280;">${escapeHtml(r.label)}:</span> <strong>${escapeHtml(r.value)}</strong></p>`,
    )
    .join('');

  const htmlBody = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #1a1a1a; line-height: 1.5;">
      <p style="margin: 0 0 4px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: #6b7280;">Form</p>
      <p style="margin: 0 0 20px; font-size: 18px; font-weight: 700;">
        ${escapeHtml(definition.subjectLabel)}${isWaitlist ? ' <span style="color:#b45309;">(Waitlist)</span>' : ''}
      </p>
      ${htmlRows}
    </div>
  `;

  try {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [toAddress],
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });
    if (error) {
      console.error('Resend error:', error);
      return fail(502, 'Could not send your message. Please try again later.');
    }
  } catch (err) {
    console.error('Resend threw:', err);
    return fail(502, 'Could not send your message. Please try again later.');
  }

  return ok();
};

// Reject other methods cleanly.
export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), {
    status: 405,
    headers: { 'content-type': 'application/json', Allow: 'POST' },
  });
