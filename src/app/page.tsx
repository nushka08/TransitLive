'use client';

import { useState, useEffect } from 'react';
import {
  Bus,
  MapPin,
  Calendar,
  Wallet,
  Sparkles,
  Loader2,
  History,
  Share2,
  Check,
  Compass,
  Train,
  ShieldCheck,
  ArrowRight,
  LogOut,
  UserCheck,
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [form, setForm] = useState({
    destination: '',
    days: 3,
    budget: 'Moderate',
    companion: 'Solo',
    transitMode: 'Metro & Subways',
  });
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<any>(null);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [pastTrips, setPastTrips] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('transit_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    loadRecentTrips();
  }, []);

  const loadRecentTrips = async () => {
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      if (data.trips) setPastTrips(data.trips);
    } catch (err) {
      console.error('Failed to load past trips', err);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('transit_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('transit_user');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTrip(null);
    setCurrentTripId(null);
    setError(null);

    try {
      const res = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate itinerary');
      if (data.trip) {
        setTrip(data.trip.itineraryData);
        setCurrentTripId(data.trip.id);
        loadRecentTrips();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPastTrip = (pastTrip: any) => {
    setTrip(pastTrip.itinerary_data);
    setCurrentTripId(pastTrip.id);
    const element = document.getElementById('planner-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const copyTripLink = () => {
    if (!currentTripId) return;
    const shareUrl = `${window.location.origin}/trips/${currentTripId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToPlanner = () => {
    document.getElementById('planner-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation Header */}
      <nav className="border-b border-zinc-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600">
              <Bus className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight" style={{ color: '#4a3728' }}>TransitLive   
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-600 hidden sm:inline flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold rounded-lg border border-zinc-200 text-[#2b2523] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-[#2b2523] transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Next-Gen AI Transit Architect
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          <span style={{ color: '#4a3728' }}>Navigate Cities</span> <br />
          <span className="text-emerald-600">Like a True Local</span>
        </h1>
        <p className="text-zinc-600 text-base md:text-lg max-w-2xl mx-auto font-normal">
          Say goodbye to overpriced taxis and fragmented timetables. Generate multi-day city itineraries optimized with real subway, tram, and bus transit legs.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={scrollToPlanner}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 text-sm"
          >
            Start Planning Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-6 py-12 border-y border-zinc-200/80 bg-zinc-100/60">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-3">
            <div className="p-2.5 w-fit bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl">
              <Train className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#2b2523]">Public Transit Precision</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Every activity comes with precise subway lines, tram stops, or bus numbers so you spend less time confused and more time exploring.
            </p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-3">
            <div className="p-2.5 w-fit bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#2b2523]">Smart Spatial Ordering</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Stops are sequenced geographically to prevent zigzagging across town, optimizing your daily commuting passes.
            </p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-3">
            <div className="p-2.5 w-fit bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#2b2523]">Instant Cloud Persistence</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Your generated plans are immediately saved to high-speed Neon PostgreSQL, ready to reload or share with friends on mobile.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Planner Section */}
      <section id="planner-section" className="px-6 py-16 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2b2523]">Generate Your Itinerary</h2>
          <p className="text-xs text-zinc-500">Choose your destination and let Gemini calculate the optimal routes.</p>
        </div>

        {/* Recent Searches Pill Bar */}
        {pastTrips.length > 0 && (
          <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
              <History className="w-4 h-4 text-zinc-400" />
              <span>SAVED ITINERARIES IN NEON DB</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {pastTrips.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPastTrip(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    currentTripId === p.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-[#2b2523]'
                  }`}
                >
                  {p.destination} ({p.days}d)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-6 md:p-8 rounded-2xl shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-1.5">Destination</label>
              <div className="flex items-center bg-zinc-50 rounded-xl px-3 border border-zinc-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition">
                <MapPin className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g., Tokyo, Berlin, New York"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  className="bg-transparent py-2.5 w-full text-sm outline-none text-[#2b2523] placeholder:text-zinc-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-1.5">Duration (Days)</label>
              <div className="flex items-center bg-zinc-50 rounded-xl px-3 border border-zinc-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition">
                <Calendar className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) || 1 })}
                  className="bg-transparent py-2.5 w-full text-sm outline-none text-[#2b2523]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-1.5">Budget</label>
              <div className="flex items-center bg-zinc-50 rounded-xl px-3 border border-zinc-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition">
                <Wallet className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="bg-transparent py-2.5 w-full text-sm outline-none text-[#2b2523] cursor-pointer"
                >
                  <option value="Backpacker / Low">Backpacker / Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-1.5">Transit Focus</label>
              <div className="flex items-center bg-zinc-50 rounded-xl px-3 border border-zinc-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition">
                <Bus className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <select
                  value={form.transitMode}
                  onChange={(e) => setForm({ ...form, transitMode: e.target.value })}
                  className="bg-transparent py-2.5 w-full text-sm outline-none text-[#2b2523] cursor-pointer"
                >
                  <option value="Metro & Subways">Metro & Subways</option>
                  <option value="Buses & Light Rail">Buses & Light Rail</option>
                  <option value="Walk + Public Transit Mix">Walk + Public Transit Mix</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Generating Transit Routes...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate Itinerary
              </>
            )}
          </button>
        </form>

        {/* Generated Itinerary Display */}
        {trip && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="border-b border-zinc-200 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#2b2523]">{trip.tripTitle}</h2>
                <p className="text-zinc-600 mt-1 text-sm">{trip.overview}</p>
              </div>
              {currentTripId && (
                <button
                  onClick={copyTripLink}
                  className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-[#2b2523] rounded-xl border border-zinc-200 transition cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-zinc-500" />}
                  <span>{copied ? 'Copied Link!' : 'Share Trip'}</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              {trip.dailyPlan?.map((day: any) => (
                <div key={day.day} className="bg-zinc-50 p-5 rounded-xl border border-zinc-200/80 space-y-3">
                  <h3 className="font-semibold text-lg text-[#2b2523]">
                    Day {day.day}: {day.theme}
                  </h3>
                  <div className="space-y-3">
                    {day.activities?.map((act: any, i: number) => (
                      <div key={i} className="pl-4 border-l-2 border-emerald-500 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                          <span>{act.time}</span> • <span className="text-[#2b2523]">{act.place}</span>
                        </div>
                        <p className="text-sm text-zinc-600">{act.description}</p>
                        <div className="text-xs bg-white p-2.5 rounded-lg border border-zinc-200 text-emerald-800 font-mono flex items-center gap-2 shadow-xs">
                          <Bus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{act.transitInfo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {trip.transitTips?.length > 0 && (
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl space-y-2">
                <h4 className="text-sm font-semibold text-emerald-900">Local Transit Tips</h4>
                <ul className="list-disc list-inside text-xs text-emerald-800 space-y-1">
                  {trip.transitTips.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 px-6 text-center text-xs text-zinc-500 bg-white">
        <p>© 2026 TransitLive. AI Itineraries powered by Gemini & Neon PostgreSQL.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}