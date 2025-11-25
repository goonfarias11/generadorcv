'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalResumes: 0,
    todayResumes: 0,
    weekResumes: 0,
    monthResumes: 0,
    proUsers: 0,
    freeUsers: 0,
    totalRevenue: 0,
    monthRevenue: 0,
    conversionRate: 0,
    topTemplates: [],
    exportStats: {},
    dailyActivity: [],
  });

  useEffect(() => {
    // Verificar si ya está autenticado
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadAnalytics();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Password simple (cambiar en producción)
    if (password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      loadAnalytics();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const loadAnalytics = () => {
    // En producción, hacer fetch a API real
    // Por ahora, datos de demostración
    setStats({
      totalResumes: 1247,
      todayResumes: 34,
      weekResumes: 189,
      monthResumes: 823,
      proUsers: 87,
      freeUsers: 412,
      totalRevenue: 869.13,
      monthRevenue: 245.73,
      conversionRate: 17.4,
      topTemplates: [
        { name: 'Premium', count: 342 },
        { name: 'ATS', count: 298 },
        { name: 'Executive', count: 187 },
        { name: 'Creative', count: 156 },
        { name: 'Minimalista', count: 89 },
      ],
      exportStats: {
        pdf: 1024,
        png: 187,
        docx: 134,
        zip: 56,
      },
      dailyActivity: [
        { date: '2024-01-01', resumes: 12 },
        { date: '2024-01-02', resumes: 18 },
        { date: '2024-01-03', resumes: 24 },
        { date: '2024-01-04', resumes: 31 },
        { date: '2024-01-05', resumes: 28 },
        { date: '2024-01-06', resumes: 35 },
        { date: '2024-01-07', resumes: 34 },
      ],
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            🔒 Admin Panel
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Ingresa la contraseña para acceder
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none mb-4"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            >
              Entrar
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-4">
            Demo: usa "admin123" como contraseña
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 Panel de Analytics
            </h1>
            <p className="text-gray-600">
              Estadísticas en tiempo real de GeneradorCV
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
          >
            ← Volver al inicio
          </button>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="CVs Generados Hoy"
            value={stats.todayResumes}
            icon="📄"
            color="blue"
          />
          <StatCard
            title="CVs Esta Semana"
            value={stats.weekResumes}
            icon="📅"
            color="green"
          />
          <StatCard
            title="CVs Este Mes"
            value={stats.monthResumes}
            icon="📈"
            color="purple"
          />
          <StatCard
            title="Total CVs"
            value={stats.totalResumes}
            icon="🎯"
            color="orange"
          />
        </div>

        {/* Revenue & Users */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Usuarios PRO"
            value={stats.proUsers}
            icon="💎"
            color="indigo"
          />
          <StatCard
            title="Usuarios FREE"
            value={stats.freeUsers}
            icon="👤"
            color="gray"
          />
          <StatCard
            title="Tasa de Conversión"
            value={`${stats.conversionRate}%`}
            icon="📊"
            color="green"
          />
        </div>

        {/* Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="text-5xl mb-4">💰</div>
            <div className="text-sm font-semibold opacity-90 mb-2">
              Ingresos Totales
            </div>
            <div className="text-5xl font-bold mb-2">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <div className="text-sm opacity-75">
              Desde el inicio
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="text-5xl mb-4">📅</div>
            <div className="text-sm font-semibold opacity-90 mb-2">
              Ingresos Este Mes
            </div>
            <div className="text-5xl font-bold mb-2">
              ${stats.monthRevenue.toFixed(2)}
            </div>
            <div className="text-sm opacity-75">
              {new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Templates & Exports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Templates */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              🎨 Plantillas Más Usadas
            </h2>
            <div className="space-y-4">
              {stats.topTemplates.map((template, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {template.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${(template.count / stats.topTemplates[0].count) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-700 font-semibold min-w-[3rem] text-right">
                      {template.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              💾 Estadísticas de Exportación
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.exportStats).map(([format, count], idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center font-bold text-purple-600 uppercase text-sm">
                      {format}
                    </div>
                    <span className="font-semibold text-gray-900">
                      Formato {format.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.exportStats.pdf) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-700 font-semibold min-w-[3rem] text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            📈 Actividad de los Últimos 7 Días
          </h2>
          <div className="flex items-end justify-between gap-2 h-64">
            {stats.dailyActivity.map((day, idx) => {
              const maxResumes = Math.max(...stats.dailyActivity.map(d => d.resumes));
              const height = (day.resumes / maxResumes) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-sm font-bold text-gray-900">
                    {day.resumes}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all hover:from-indigo-700 hover:to-purple-600"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-gray-600 text-center">
                    {new Date(day.date).toLocaleDateString('es', { weekday: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    indigo: 'from-indigo-500 to-indigo-600',
    gray: 'from-gray-500 to-gray-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl shadow-lg p-6 text-white`}>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-sm font-semibold opacity-90 mb-1">
        {title}
      </div>
      <div className="text-4xl font-bold">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}
