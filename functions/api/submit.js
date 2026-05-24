// Cloudflare Pages Function: handles POST /api/submit
// This follows the Pages Functions convention: /functions maps to routes. 
// Optionally verify Turnstile if you set TURNSTILE_SECRET.

export async function onRequestPost(context) {
  const { request, env } = context;

  const form = await request.formData();
  const name = (form.get("name") || "").toString().trim();
  const email = (form.get("email") || "").toString().trim();
  const company = (form.get("company") || "").toString().trim();
  const message = (form.get("message") || "").toString().trim();
  const token = (form.get("cf-turnstile-response") || "").toString();

  if (!name || !email || !message) {
    return new Response("Missing required fields.", { status: 400 });
  }

  // Turnstile verification (recommended). If you don't configure it, this block is skipped.
  if (env.TURNSTILE_SECRET) {
    const ip = request.headers.get("CF-Connecting-IP") || "";
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: ip
      })
    }).then(r => r.json());

    if (!resp.success) {
      return new Response("Turnstile verification failed.", { status: 403 });
    }
  }

  // Optional storage: bind a D1 database named DB in Pages project settings.
  if (env.DB) {
    await env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, company TEXT, message TEXT, created_at TEXT)"
    ).run();

    await env.DB.prepare(
      "INSERT INTO leads (name, email, company, message, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
    ).bind(name, email, company, message).run();
  }

  // Redirect to a success page.
  return Response.redirect(new URL("/pages/thanks/", request.url).toString(), 303);
}
