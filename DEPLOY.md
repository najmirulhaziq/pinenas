# Deploying Pinenas with a working (secure) AI chat

Your Gemini key used to live inside `index.html`, which is why GitHub/Google
kept revoking it — anyone viewing the page source could read it. Now the key
only lives on Vercel's servers, in `api/chat.js`, and never touches the
browser or your git repo.

## 1. Get a fresh Gemini API key
Your old key (`AQ.Ab8RN6Kl...`) is already exposed publicly and should be
treated as compromised — revoke it and generate a new one:
https://aistudio.google.com/app/apikey

## 2. Push this folder to GitHub
```bash
git init
git add .
git commit -m "Pinenas site with secure server-side AI chat"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
(No key is in any file here, so GitHub's secret scanner won't flag anything.)

## 3. Import the repo into Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Framework preset: "Other" (it's a static site + one API function — Vercel
   detects the `api/` folder automatically)
4. Before deploying, add an Environment Variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your new key from step 1
5. Click Deploy

## 4. Test it
Once deployed, open your Vercel URL, open the chat widget, and send a message.
The browser calls `/api/chat` (same-origin, no key visible), and that
function calls Gemini with the key from Vercel's environment — never exposed
to the client or committed to git.

## Notes
- If you still want a GitHub Pages copy of the site for browsing, that's
  fine — just know the chat widget will only work on the Vercel-hosted
  version, since GitHub Pages can't run the `/api/chat.js` serverless
  function.
- If you ever change hosts, redeploy the `api/chat.js` function too — the
  frontend and backend need to live behind the same domain (or you'll need
  to update the fetch URL and enable CORS).
