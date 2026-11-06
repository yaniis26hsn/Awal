# Awal

> Paste your text. Get it fixed or improved. Copy. Done.

**Awal** ("word" in Kabyle) is a tiny, fast web app that corrects grammar and spelling errors, and can optionally improve or fully rewrite your text. One screen, no login, no setup.

**Live demo:** _coming soon_

## Features

- **Fix errors** (default): corrects spelling, grammar and punctuation only, keeping your wording and voice
- **Improve**: clearer wording and better flow, same meaning
- **Rewrite**: a full rephrase that preserves the facts
- **Tone selector** (Improve and Rewrite only): Neutral (default), Formal, Friendly, Professional, Concise
- **One-click Paste and Copy** buttons
- **Show changes**: a word-level diff between your text and the result
- Works with **Arabic, French, English** and mixed-language text (RTL supported)
- Installable as a **PWA**, with light and dark mode
- **Privacy first**: your text is never stored or logged

## Quick Start

```bash
git clone https://github.com/<your-username>/awal.git
cd awal
npm install
cp .env.example .env.local   # add your API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Create `.env.local` with:

```
ANTHROPIC_API_KEY=your_key_here
MODEL_FAST=claude-haiku-5-5
MODEL_QUALITY=claude-sonnet-5-5
MAX_INPUT_CHARS=5000
```

Optional, for rate limiting in production:

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Usage

1. Click **Paste** (or type) your text.
2. Leave **Fix errors** selected, or pick **Improve** / **Rewrite** (and a tone if you want).
3. Press **Polish** (or `Ctrl/Cmd + Enter`).
4. Click **Copy**.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- Claude API with streaming responses
- [`diff`](https://github.com/kpdecker/jsdiff) for the change view
- Zod for validation, Vitest and Playwright for tests

## How It Works

The browser sends the text, mode and tone to `POST /api/polish`. The server validates the request, applies rate limiting, calls the AI API with a mode-specific prompt, and streams the result back. The API key never reaches the client, and the diff is computed in the browser.

## Project Structure

```
app/            # pages and the /api/polish route
components/     # UI components
lib/            # prompts, models, schema, helpers
hooks/          # usePolish, usePersistedState
public/         # manifest and icons
```

## Roadmap

- [ ] Translate mode
- [ ] Auto-run after paste
- [ ] UI in French and Arabic
- [ ] Browser extension ("Polish selection")
- [ ] Custom tone ("write like me")

## Contributing

Contributions are welcome. Open an issue to discuss a change, then submit a pull request. Please keep the core goal in mind: **every action should take as few clicks as possible.**

## License

MIT
