# Foodie-Lab

Foodie Lab Catering — booking site with instant quote, package builder, WhatsApp/email order handoff, and ops desk.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b537842c-fcdf-4a71-afca-5d5a275cf458

> **Important:** Code changes in Cursor do **not** appear on the AI Studio link above.  
> To test WhatsApp/Email order flow, run locally — see **[HOW-TO-SEE-CHANGES.md](./HOW-TO-SEE-CHANGES.md)**.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
