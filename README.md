# Foodie Lab Catering

Modern catering website for **Foodie Lab** — instant quotes, package builder, customer bookings, and an internal ops desk.

**Live repo:** [github.com/DaniyalQais/Foodie-Lab](https://github.com/DaniyalQais/Foodie-Lab)

## Features

- Instant quote calculator with package tiers and add-ons
- Full catering order flow (tacos, enchiladas, quesadillas, custom items)
- **WhatsApp** or **email** handoff when customers submit orders
- Ops desk for managing inquiries (local storage demo data)
- Mobile-friendly layout

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- [Web3Forms](https://web3forms.com) for order emails
- WhatsApp `wa.me` links for order messages

## Run locally

**Prerequisites:** [Node.js](https://nodejs.org/) 18+

```bash
npm install
```

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

Get a free key at [web3forms.com](https://web3forms.com) and set the notification email to your inbox.

Start the dev server:

```bash
npm run dev
```

Open in your browser:

- **Laptop:** [http://localhost:3000](http://localhost:3000)
- **Phone (same Wi‑Fi):** use the `Network` URL from the terminal (e.g. `http://192.168.x.x:3000`)

For a clean cache: `npm run dev:fresh` or double-click `start-dev.bat`.

## Order notifications

1. Customer completes the booking form and chooses **WhatsApp** or **Email**.
2. **WhatsApp** opens with the order pre-filled (customer taps Send in WhatsApp).
3. **Email** sends via Web3Forms to the address configured on your Web3Forms form.

Business contact defaults are in `src/data/business.ts`.

## Project structure

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Main app shell and routing |
| `src/components/MenuPresentation.tsx` | Package selection & checkout |
| `src/components/PriceEstimator.tsx` | Instant quote |
| `src/lib/notifyOwner.ts` | Email (Web3Forms) helpers |
| `src/lib/whatsapp.ts` | WhatsApp message builder |

## Build for production

```bash
npm run build
npm run preview
```

## License

Private project — Foodie Lab Catering.
