# Step Up 15 Days Bootcamp — Registration Site

Modern homepage and registration portal for the **Step Up 15 Days Bootcamp Summer** in Agege-Dopemu, Lagos. Participant registrations are delivered to your **Telegram** chat instantly.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connect Telegram (required for registrations)

1. Open Telegram and message **@BotFather** → `/newbot` → copy the bot token.
2. Start a chat with your new bot (send any message), or add the bot to a group/channel.
3. Get your chat ID:
   - Personal chat: message **@userinfobot**, or
   - Open `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` after messaging the bot and copy `chat.id`.
4. Copy `.env.example` to `.env.local` and fill in:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

5. Restart `npm run dev`. Submit a test registration — you should get a formatted message on Telegram.

## Blog & admin panel

- Public blog: [/blog](http://localhost:3001/blog)
- Admin login: [/admin](http://localhost:3001/admin)
- Default local password: `remibello-admin` (set `ADMIN_PASSWORD` in `.env.local`)

Admins can create, edit, publish/unpublish, and delete posts. Each public post includes share buttons for WhatsApp, Facebook, X, LinkedIn, Telegram, and copy-link.

Registered participants are saved automatically and listed at [/admin/registrations](http://localhost:3001/admin/registrations) (search, filter by track, export CSV, remove).

Posts are stored in `data/posts.json` on the server. For serverless hosts (e.g. Vercel), switch this store to a database before production write access is required.

Set `NEXT_PUBLIC_SITE_URL` to your live domain so social share links and Open Graph tags use the correct absolute URL.


## Bootcamp details (from flyer)

- **When:** August 1–15, 2026 · 10AM–2PM daily  
- **Where:** Shitta Street, Dopemu Agege, Aluminium Village, Lagos  
- **Tracks:** Prompt Engineering (AI), Graphic Design, Photo Editing  
- **Fee:** Free · limited slots  
- **Enquiries:** 07035965544
