import sql from '@/lib/db';
import { Bus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [tripRecord] = await sql`
    SELECT * FROM trips WHERE id = ${id}
  `;

  if (!tripRecord) {
    notFound();
  }

  const trip = tripRecord.itinerary_data;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Planner
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-bold text-emerald-400">{trip.tripTitle}</h1>
            <p className="text-slate-400 mt-2 text-sm">{trip.overview}</p>
          </div>

          <div className="space-y-6">
            {trip.dailyPlan?.map((day: any) => (
              <div key={day.day} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 space-y-3">
                <h2 className="font-semibold text-lg text-slate-200">
                  Day {day.day}: {day.theme}
                </h2>
                <div className="space-y-3">
                  {day.activities?.map((act: any, i: number) => (
                    <div key={i} className="pl-4 border-l-2 border-emerald-500/40 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span>{act.time}</span> • <span className="text-slate-200">{act.place}</span>
                      </div>
                      <p className="text-sm text-slate-300">{act.description}</p>
                      <div className="text-xs bg-slate-950/60 p-2 rounded border border-slate-800 text-emerald-300 font-mono flex items-center gap-2">
                        <Bus className="w-3.5 h-3.5 shrink-0" />
                        <span>{act.transitInfo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {trip.transitTips?.length > 0 && (
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl space-y-2">
              <h3 className="text-sm font-semibold text-emerald-400">Local Transit Tips</h3>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {trip.transitTips.map((tip: string, idx: number) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}