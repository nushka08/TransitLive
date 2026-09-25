import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const trips = await sql`
      SELECT id, destination, days, budget, transit_mode, itinerary_data, created_at
      FROM trips
      ORDER BY created_at DESC
      LIMIT 6
    `;

    return NextResponse.json({ success: true, trips });
  } catch (error: any) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}