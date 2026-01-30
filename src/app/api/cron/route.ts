import { NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (optional security)
  const authHeader = request.headers.get('authorization');

  // In production, you can add: if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {...}

  try {
    // Get current analytics data
    const data = getAnalyticsData();

    // Log the update (useful for debugging cron runs)
    console.log(`[CRON] Analytics data refreshed at ${new Date().toISOString()}`);
    console.log(`[CRON] Display date: ${data.displayDate}`);
    console.log(`[CRON] Grand total: ${data.grandTotal.total.toLocaleString()}`);

    return NextResponse.json({
      success: true,
      message: 'Analytics data refreshed',
      timestamp: new Date().toISOString(),
      displayDate: data.displayDate,
      grandTotal: data.grandTotal.total,
    });
  } catch (error) {
    console.error('[CRON] Error refreshing data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh data' },
      { status: 500 }
    );
  }
}
