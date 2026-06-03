# Why you still see the old site

Edits in Cursor **do not** update this link automatically:

**https://ai.studio/apps/b537842c-fcdf-4a71-afca-5d5a275cf458**

That is a **Google AI Studio** copy of the app (old UI). You must run the project **on your PC**.

---

## Run the real app (Windows)

1. Open **Terminal** in Cursor: `Terminal` → `New Terminal`
2. Go to the project folder (copy/paste):

   ```powershell
   Set-Location -LiteralPath "C:\Users\Daniyal Qais\Downloads\moms'-catering-co"
   ```

3. Install once (if needed):

   ```powershell
   npm install
   ```

4. Start the server:

   ```powershell
   npm run dev:fresh
   ```

5. In the output you should see something like:

   ```text
   Local:   http://localhost:3000/
   Network: http://192.168.x.x:3000/
   ```

6. On your **PC browser**, open: **http://localhost:3000**

7. On your **phone** (same Wi‑Fi), open the **Network** URL (the `192.168...` one).

---

## How you know it worked

You **must** see all of these:

| Check | New app | Old app (AI Studio) |
|-------|---------|---------------------|
| Green bar at bottom | `LOCAL DEV · build send-picker-v8` | Missing or red “WRONG URL” |
| Header badge | `send-picker-v8` | Not there |
| Submit button | `Submit — choose WhatsApp or Email` | `Submit Request — No Payment Due Now` |
| After Submit | Popup: **How should we receive your order?** | WhatsApp opens immediately |
| Success title | WhatsApp or Email flow | “We’ve got you covered” |

If you do **not** see `send-picker-v8`, you are **not** on the updated site.

### Laptop quick start

Double-click **`start-dev.bat`** in the project folder, then open **Chrome** to:

**http://localhost:3000**

Do not use Cursor’s preview panel only — use a normal browser window.

---

## Do not use for testing

- AI Studio preview link (old build)
- Old bookmarks
- Cached tab without hard refresh

---

## Email (.env)

File: `.env`

```env
VITE_WEB3FORMS_ACCESS_KEY=26b08797-532a-47c0-8624-ca3377531f6d
```

Restart `npm run dev:fresh` after changing `.env`.
