# FarmCast 🌤️

> AI-powered weather dashboard built for Kenya, powered by the [WeatherAI API](https://weather-ai.co).

![FarmCast](https://img.shields.io/badge/Built%20with-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38BDF8?style=flat-square&logo=tailwindcss)
![WeatherAI](https://img.shields.io/badge/API-WeatherAI-10b981?style=flat-square)

---

## What is FarmCast?

FarmCast is a clean, minimal weather dashboard that automatically detects your location and gives you:

-  **Current conditions** — temperature, humidity, wind speed, UV index
-  **AI-generated weather summary** — powered by WeatherAI's Gemini AI insights
- **7-day forecast** — daily highs, lows, and rain probability
-  **City search** — look up weather anywhere in the world

Built as a technical challenge integrating the [WeatherAI REST API](https://weather-ai.co/docs).

---

## Live Demo

 [farmcast.vercel.app](https://farmcast.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Fonts | Syne (display) + DM Sans (body) via Google Fonts |
| Weather data | WeatherAI API |
| Geocoding | OpenStreetMap Nominatim (free, no key needed) |
| Deployment | Vercel |

---


## Project Structure

```
farmcast/
├── index.html             
├── package.json            
├── vite.config.js         
├── tailwind.config.js      
├── postcss.config.js       
├── .env.example            
├── .gitignore              
├── README.md              
└── src/
    ├── main.jsx            
    ├── index.css          
    └── App.jsx             # All components and app logic
```

---

## Local Setup

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org) v18 or higher
- npm (comes with Node.js)
- A free WeatherAI API key from [weather-ai.co](https://weather-ai.co)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/LEAKONO/farmcast.git
cd farmcast
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up your environment variable**
```bash
cp .env.example .env
```

Then open `.env` and replace the placeholder with your real API key:
```
VITE_WEATHER_API_KEY=wai_your_actual_key_here
```

> ⚠️ The `VITE_` prefix is required. Vite will not expose the variable to your React code without it.

**4. Start the development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Getting a WeatherAI API Key

1. Go to [weather-ai.co](https://weather-ai.co) and create a free account
2. Navigate to **Dashboard → API Keys**
3. Click **Create Key** — your key will start with `wai_`
4. Copy it and paste it into your `.env` file

> The free plan gives you **1,000 requests/month** and **200 AI summaries/month** — more than enough for development and demos.

---

## Deployment (Vercel)

**Option A — Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B — GitHub integration**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. In **Settings → Environment Variables**, add:
   - Key: `VITE_WEATHER_API_KEY`
   - Value: your `wai_...` key
4. Click **Deploy**

> Do NOT commit your `.env` file. It is already in `.gitignore`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server at localhost:5173 |
| `npm run build` | Build for production into the `dist/` folder |
| `npm run preview` | Preview the production build locally |

---

## How It Works

1. **On load** — the app calls `/v1/weather-geo?ip=auto` which auto-detects your location from your IP address and returns weather data + the detected city name from response headers (`X-City`)
2. **Fallback** — if geo-detection fails, it defaults to Nairobi, Kenya
3. **City search** — when you search a city name, it geocodes it via OpenStreetMap Nominatim (no API key needed) to get lat/lon, then calls `/v1/weather` with those coordinates
4. **AI summary** — the `ai=true` parameter on every request returns a Gemini-powered plain-English weather summary which is displayed in the AI Insight card
5. **Flexible parsing** — the response parser checks multiple possible field names (`temp_c`, `temperature`, `temp`) so the app handles any minor changes in the API response shape gracefully

---

## Author

**Emmanuel Leakono**
- GitHub: [@LEAKONO](https://github.com/LEAKONO)
- LinkedIn: [linkedin.com/in/emmanuel-leakono](https://linkedin.com/in/emmanuel-leakono)

---

## License

MIT — free to use, modify, and distribute.