import { getAnalyticsData } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  const data = getAnalyticsData();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          OTT Analytics Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Daily Stats Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-600 text-white text-center py-3">
              <h2 className="text-xl font-bold">{data.displayDate}</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left font-bold text-gray-700">PLATAFORMA</th>
                  <th className="py-3 px-4 text-right font-bold text-gray-700">UNIDADES TOTALES</th>
                </tr>
              </thead>
              <tbody>
                {data.platforms.map((platform, index) => (
                  <tr
                    key={platform.platform}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">{platform.platform}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {platform.dailyUnits.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-100">
                  <td className="py-3 px-4 font-bold text-gray-800">TOTAL</td>
                  <td className="py-3 px-4 text-right font-bold text-gray-800">
                    {data.grandTotal.daily.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Stats Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-400 text-white text-center py-3">
              <h2 className="text-xl font-bold">TOTAL</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left font-bold text-gray-700">PLATAFORMA</th>
                  <th className="py-3 px-4 text-right font-bold text-gray-700">UNIDADES TOTALES</th>
                </tr>
              </thead>
              <tbody>
                {data.platforms.map((platform, index) => (
                  <tr
                    key={platform.platform}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">{platform.platform}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {platform.totalUnits.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-100">
                  <td className="py-3 px-4 font-bold text-gray-800">TOTAL</td>
                  <td className="py-3 px-4 text-right font-bold text-gray-800">
                    {data.grandTotal.total.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Apps Section */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-400 text-white text-center py-3">
              <h2 className="text-xl font-bold">APLICACIONES MÓVILES</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left font-bold text-gray-700">PLATAFORMA</th>
                  <th className="py-3 px-4 text-right font-bold text-gray-700">UNIDADES TOTALES</th>
                </tr>
              </thead>
              <tbody>
                {data.mobileApps.map((app, index) => (
                  <tr
                    key={app.platform}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">{app.platform}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {app.totalUnits.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Los datos se actualizan automáticamente. Última actualización: {new Date().toLocaleString('es-MX')}</p>
          <p className="mt-1">Los datos mostrados tienen un día de retraso</p>
        </div>
      </main>
    </div>
  );
}
