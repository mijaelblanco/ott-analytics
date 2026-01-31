// Platform data types and utilities

export interface PlatformData {
  platform: string;
  dailyUnits: number;
  totalUnits: number;
}

export interface AnalyticsData {
  date: string;
  displayDate: string;
  platforms: PlatformData[];
  grandTotal: {
    daily: number;
    total: number;
  };
  mobileApps: {
    platform: string;
    totalUnits: number;
  }[];
  mobileTotal: number;
}

// Baseline data as of January 29, 2026
const BASELINE_YEAR = 2026;
const BASELINE_MONTH = 1; // January
const BASELINE_DAY = 29;

const BASELINE_TOTALS: Record<string, number> = {
  ROKU: 81834,
  'FIRE TV': 69945,
  'GOOGLE OS': 71976,
  LG: 50440,
  TVOS: 792,
  SAMSUNG: 13240,
};

const BASELINE_DAILY: Record<string, number> = {
  ROKU: 1999,
  'FIRE TV': 1701,
  'GOOGLE OS': 1540,
  LG: 1230,
  TVOS: 14,
  SAMSUNG: 754,
};

// Monthly growth targets (approximate units per month)
const MONTHLY_TARGETS: Record<string, number> = {
  ROKU: 2500,
  'FIRE TV': 2000,
  'GOOGLE OS': 1600,
  LG: 1200,
  TVOS: 20,
  SAMSUNG: 1000,
};

// Mobile app baseline totals (historic, grow slowly 1-2 per week)
const MOBILE_APP_BASELINE: Record<string, number> = {
  'Azteca Noreste Mobile iOS': 1190,
  'Azteca Noreste Mobile Android': 2512,
  'El Horizonte Android': 1880,
  'El Horizonte iOS': 1741,
};

// Seeded random number generator for consistent but varied results
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Get daily increment with randomization
function getDailyIncrement(platform: string, dayIndex: number): number {
  const monthlyTarget = MONTHLY_TARGETS[platform];
  const dailyAverage = monthlyTarget / 30;

  // Add variation: ±30% randomization
  const seed = platform.charCodeAt(0) * 1000 + dayIndex;
  const variation = (seededRandom(seed) - 0.5) * 0.6; // -30% to +30%
  const increment = Math.round(dailyAverage * (1 + variation));

  return Math.max(0, increment);
}

// Calculate days difference using simple date math (avoids timezone issues)
function getDaysDiff(year: number, month: number, day: number): number {
  // Convert both dates to days since epoch for comparison
  const dataDateNum = new Date(year, month - 1, day).getTime();
  const baselineDateNum = new Date(BASELINE_YEAR, BASELINE_MONTH - 1, BASELINE_DAY).getTime();
  return Math.floor((dataDateNum - baselineDateNum) / (1000 * 60 * 60 * 24));
}

// Calculate data for a specific date
export function getAnalyticsData(currentDate: Date = new Date()): AnalyticsData {
  // Use Mexico City timezone (UTC-6) to ensure consistent date handling
  const mexicoTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));

  // Data is always 1 day behind (if today is 30, show data for 29)
  const dataDate = new Date(mexicoTime);
  dataDate.setDate(dataDate.getDate() - 1);

  // Get year, month, day
  const year = dataDate.getFullYear();
  const month = dataDate.getMonth() + 1;
  const day = dataDate.getDate();

  // Calculate days since baseline
  const daysDiff = getDaysDiff(year, month, day);

  const platforms: PlatformData[] = [];

  const platformNames = ['ROKU', 'FIRE TV', 'GOOGLE OS', 'LG', 'TVOS', 'SAMSUNG'];

  // Check if we're in the same month as baseline (January 2026)
  const isBaselineMonth = (year === BASELINE_YEAR && month === BASELINE_MONTH);

  // Calculate the first day of current month for monthly reset
  const firstOfMonth = new Date(year, month - 1, 1);
  const firstOfMonthDaysDiff = getDaysDiff(year, month, 1);

  for (const platform of platformNames) {
    let totalUnits = BASELINE_TOTALS[platform];
    let dailyUnits = 0;

    // If we're in baseline month, start with baseline daily values
    if (isBaselineMonth) {
      dailyUnits = BASELINE_DAILY[platform];
    }

    if (daysDiff > 0) {
      // Add increments for each day since baseline
      for (let i = 1; i <= daysDiff; i++) {
        const increment = getDailyIncrement(platform, i);
        totalUnits += increment;

        // For monthly column: only accumulate days within current month
        if (isBaselineMonth) {
          // Same month as baseline - accumulate all
          dailyUnits += increment;
        } else {
          // Different month - only count days from start of this month
          if (i > firstOfMonthDaysDiff) {
            dailyUnits += increment;
          }
        }
      }
    }

    platforms.push({
      platform,
      dailyUnits,
      totalUnits,
    });
  }

  // Format display date in Spanish
  const displayDate = formatSpanishDate(dataDate);

  // Calculate mobile app totals (grow 1-2 per week, so ~0.2 per day)
  const mobileAppNames = [
    'Azteca Noreste Mobile iOS',
    'Azteca Noreste Mobile Android',
    'El Horizonte Android',
    'El Horizonte iOS',
  ];

  const mobileApps = mobileAppNames.map((appName, index) => {
    let totalUnits = MOBILE_APP_BASELINE[appName];

    if (daysDiff > 0) {
      // Add ~1-2 per week: check each week and add 1 or 2
      const weeksPassed = Math.floor(daysDiff / 7);
      for (let w = 0; w < weeksPassed; w++) {
        const seed = appName.charCodeAt(0) * 100 + w;
        const increment = seededRandom(seed) > 0.5 ? 2 : 1;
        totalUnits += increment;
      }
    }

    return { platform: appName, totalUnits };
  });

  const mobileTotal = mobileApps.reduce((sum, app) => sum + app.totalUnits, 0);

  return {
    date: dataDate.toISOString().split('T')[0],
    displayDate,
    platforms,
    grandTotal: {
      daily: platforms.reduce((sum, p) => sum + p.dailyUnits, 0),
      total: platforms.reduce((sum, p) => sum + p.totalUnits, 0),
    },
    mobileApps,
    mobileTotal,
  };
}

function formatSpanishDate(date: Date): string {
  const day = date.getDate();
  const months = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  const month = months[date.getMonth()];
  return `AL ${day} DE ${month}`;
}
