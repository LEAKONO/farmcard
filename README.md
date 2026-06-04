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
git clone https://github.com/LEAKONO/farmcard.git

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



## Deployment (Vercel)

**Option A — Vercel CLI**
```bash
npm install -g vercel
vercel
```

## Author

**Emmanuel Leakono**
- GitHub: [@LEAKONO](https://github.com/LEAKONO)
- LinkedIn: [linkedin.com/in/emmanuel-leakono](https://linkedin.com/in/emmanuel-leakono)

---

## License

MIT — free to use, modify, and distribute.