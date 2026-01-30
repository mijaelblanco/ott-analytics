import { NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = getAnalyticsData();

  return NextResponse.json(data);
}
