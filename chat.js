// Vercel Serverless Function: /api/chat
// This runs on Vercel's server, NOT in the browser — so the API key
// never gets sent to the client and never appears in your GitHub repo.
//
// Setup:
//   1. In your Vercel project settings, add an Environment Variable:
//      Name:  GEMINI_API_KEY
//      Value: <your real Gemini key>
//   2. Redeploy. That's it — no key is ever committed to git.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in Vercel project settings.' });
  }

  const { system_instruction, contents, generationConfig } = req.body || {};

  if (!contents) {
    return res.status(400).json({ error: 'Missing "contents" in request body' });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system_instruction, contents, generationConfig }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown server error' });
  }
}
