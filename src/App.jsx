import { useState, useEffect, useCallback } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";
const BASE    = import.meta.env.DEV
  ? "https://api.weather-ai.co/v1"
  : "/api";

const headers = () => ({ Authorization: `Bearer ${API_KEY}` });

// ─── Weather icon map ──────────────────────────────────────────────────────
function WeatherIcon({ code, size = 40 }) {
  const icons = {
    sunny:        "☀️", clear:         "☀️", "partly-cloudy": "⛅",
    cloudy:       "☁️", overcast:      "☁️", rain:           "🌧️",
    "heavy-rain": "⛈️", drizzle:       "🌦️", thunderstorm:   "⛈️",
    snow:         "❄️", fog:           "🌫️", windy:          "💨",
    default:      "🌤️",
  };
  const key = code?.toLowerCase().replace(/\s+/g, "-") ?? "default";
  const emoji = icons[key] ?? icons.default;
  return <span style={{ fontSize: size }}>{emoji}</span>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────
const dayName = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-KE", { weekday: "short" });

const geocodeCity = async (city) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  const data = await res.json();
  if (!data.length) throw new Error("City not found");
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name.split(",")[0] };
};

// reverse geocode coords → city name using OpenStreetMap
const reverseGeocode = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  const data = await res.json();
  return (
    data.address?.city     ??
    data.address?.town     ??
    data.address?.village  ??
    data.address?.county   ??
    "Your location"
  );
};

// ─── Components ───────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-emerald-400 animate-spin" />
      <p className="font-display text-white/40 text-sm tracking-widest uppercase">Reading the skies…</p>
    </div>
  );
}

function ErrorCard({ message, onRetry }) {
  return (
    <div className="glass rounded-2xl p-8 text-center max-w-md mx-auto mt-12">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="font-display text-white/80 mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-6 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-all">
          Try again
        </button>
      )}
    </div>
  );
}

function CurrentWeather({ data, cityName }) {
  const c = data.current ?? data;
  const temp  = c.temp_c ?? c.temperature ?? c.temp ?? "—";
  const feels = c.feels_like_c ?? c.feels_like ?? null;
  const humid = c.humidity ?? "—";
  const wind  = c.wind_kph ?? c.wind_speed ?? "—";
  const cond  = c.condition ?? c.description ?? c.weather ?? "Clear";
  const uv    = c.uv_index ?? c.uv ?? null;

  return (
    <div className="fade-up-1 glass rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <p className="font-display text-white/40 text-xs tracking-[0.2em] uppercase mb-2">Current Conditions</p>
          <h2 className="font-display text-5xl md:text-7xl font-extrabold text-white leading-none">
            {Math.round(temp)}<span className="text-emerald-400">°C</span>
          </h2>
          <p className="font-display text-xl text-white/70 mt-2 capitalize">{cond}</p>
          <p className="text-white/40 text-sm mt-1">{cityName}</p>
        </div>
        <div className="text-right">
          <WeatherIcon code={cond} size={72} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-8 relative z-10">
        {[
          { label: "Feels like", value: feels != null ? `${Math.round(feels)}°C` : "—" },
          { label: "Humidity",   value: `${humid}%` },
          { label: "Wind",       value: `${wind} km/h` },
        ].map(({ label, value }) => (
          <div key={label} className="glass rounded-2xl p-4 text-center">
            <p className="text-white/40 text-xs mb-1">{label}</p>
            <p className="font-display font-bold text-white text-lg">{value}</p>
          </div>
        ))}
      </div>

      {uv != null && (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" style={{ width: `${Math.min((uv / 11) * 100, 100)}%` }} />
          </div>
          <span className="text-white/40 text-xs">UV {uv}</span>
        </div>
      )}
    </div>
  );
}

function AISummary({ summary }) {
  if (!summary) return null;
  return (
    <div className="fade-up-2 glass rounded-3xl p-6 border-l-2 border-emerald-400/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-emerald-400 text-xs font-display tracking-widest uppercase">✦ AI Insight</span>
      </div>
      <p className="text-white/70 leading-relaxed text-sm md:text-base">{summary}</p>
    </div>
  );
}

function ForecastCard({ day, index }) {
  const temp_max = day.temp_max_c ?? day.max_temp ?? day.high ?? day.temp_c ?? "—";
  const temp_min = day.temp_min_c ?? day.min_temp ?? day.low ?? null;
  const cond     = day.condition ?? day.description ?? day.weather ?? "Clear";
  const rain     = day.rain_chance ?? day.precip_probability ?? null;

  return (
    <div
      className="glass glass-hover rounded-2xl p-4 flex flex-col items-center gap-3 cursor-default"
      style={{ animation: `fadeUp 0.5s ${0.3 + index * 0.06}s ease both` }}
    >
      <p className="font-display text-white/40 text-xs tracking-wider uppercase">{dayName(day.date)}</p>
      <WeatherIcon code={cond} size={32} />
      <div className="text-center">
        <p className="font-display font-bold text-white text-lg">{Math.round(temp_max)}°</p>
        {temp_min != null && <p className="text-white/30 text-sm">{Math.round(temp_min)}°</p>}
      </div>
      {rain != null && (
        <p className="text-sky-400/70 text-xs">💧 {Math.round(rain)}%</p>
      )}
    </div>
  );
}

function SearchBar({ onSearch, loading }) {
  const [val, setVal] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (val.trim()) onSearch(val.trim());
  };
  return (
    <form onSubmit={submit} className="flex gap-2 fade-up">
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Search city…"
        className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-400/50 transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-display font-bold text-sm transition-all"
      >
        {loading ? "…" : "Search"}
      </button>
    </form>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────
export default function App() {
  const [weather,   setWeather]   = useState(null);
  const [city,      setCity]      = useState("Detecting location…");
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [searching, setSearching] = useState(false);

  const fetchWeather = useCallback(async (lat, lon, name) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&days=7&units=metric&ai=true`, { headers: headers() });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setWeather(data);
      setCity(name);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use browser GPS — works correctly on both local and Vercel
  useEffect(() => {
    if (!navigator.geolocation) {
      // Browser doesn't support GPS — fall back to Nairobi
      fetchWeather(-1.2921, 36.8219, "Nairobi");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const name = await reverseGeocode(lat, lon);
        fetchWeather(lat, lon, name);
      },
      () => {
        // User denied location permission — fall back to Nairobi
        fetchWeather(-1.2921, 36.8219, "Nairobi");
      },
      { timeout: 8000 }
    );
  }, [fetchWeather]);

  const handleSearch = async (query) => {
    setSearching(true);
    try {
      const { lat, lon, name } = await geocodeCity(query);
      await fetchWeather(lat, lon, name);
    } catch (e) {
      setError(e.message);
    } finally {
      setSearching(false);
    }
  };

  const forecast  = weather?.forecast?.daily ?? weather?.daily ?? weather?.forecast ?? [];
  const aiSummary = weather?.ai_summary ?? weather?.summary ?? weather?.ai?.summary ?? null;

  return (
    <div className="min-h-screen relative">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 flex flex-col gap-5">
        {/* Header */}
        <div className="fade-up flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-white">
              Farm<span className="text-emerald-400">Cast</span>
            </h1>
            <p className="text-white/30 text-xs mt-0.5">AI Weather · Kenya</p>
          </div>
          <div className="text-right text-white/30 text-xs font-display">
            {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} loading={searching} />

        {/* Content */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorCard message={error} onRetry={() => fetchWeather(-1.2921, 36.8219, "Nairobi")} />
        ) : weather ? (
          <>
            <CurrentWeather data={weather} cityName={city} />
            {aiSummary && <AISummary summary={aiSummary} />}

            {forecast.length > 0 && (
              <div className="fade-up-3">
                <p className="font-display text-white/30 text-xs tracking-widest uppercase mb-3">7-Day Forecast</p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {forecast.slice(0, 7).map((day, i) => (
                    <ForecastCard key={day.date ?? i} day={day} index={i} />
                  ))}
                </div>
              </div>
            )}

            <p className="text-center text-white/15 text-xs font-display fade-up-4">
              Powered by WeatherAI API
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}