import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaFire, FaDownload } from 'react-icons/fa';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [growth, setGrowth] = useState([]);
  const [viralReels, setViralReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    try {
      const [overviewRes, growthRes, viralRes] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getGrowth({ timeframe }),
        analyticsAPI.getViral(),
      ]);

      setAnalytics(overviewRes.data.data);
      setGrowth(growthRes.data.data.growthData || []);
      setViralReels(viralRes.data.data.viralAlerts || []);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await analyticsAPI.export({ format: 'csv' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reel-analytics.csv';
      a.click();
      toast.success('Analytics exported successfully');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">📊 Analytics</h1>
            <div className="flex gap-4">
              <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
                <FaDownload /> Export CSV
              </button>
              <Link to="/dashboard" className="btn-secondary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Growth Chart */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">📈 Growth Trends</h2>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="input"
            >
              <option value="7d">Last 7 Days</option>
              <option value="14d">Last 14 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {growth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgViews"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  name="Avg Views"
                />
                <Line
                  type="monotone"
                  dataKey="reels"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Reels"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-dark-400 py-12">
              No growth data available for selected timeframe
            </p>
          )}
        </div>

        {/* Viral Reels */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaFire className="text-orange-500" /> Viral Reels
          </h2>

          {viralReels.length > 0 ? (
            <div className="space-y-4">
              {viralReels.map((alert, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-700 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-bold">
                        {alert.reel.category} Reel
                      </p>
                      <p className="text-dark-400 text-sm">{alert.reel.reelId}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full">
                      Viral Score: {alert.reel.viralScore}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-dark-400 text-sm">Views</p>
                      <p className="text-white font-bold">
                        {alert.reel.viewCount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-dark-400 text-sm">Quality Score</p>
                      <p className="text-white font-bold">
                        {alert.reel.qualityScore}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-dark-400 text-sm">Category</p>
                      <p className="text-white font-bold">{alert.reel.category}</p>
                    </div>
                  </div>

                  {alert.viralPotential?.hasViralPotential && (
                    <div className="mt-4 p-3 bg-dark-700 rounded-lg">
                      <p className="text-orange-400 font-medium">
                        {alert.viralPotential.message}
                      </p>
                      <p className="text-dark-400 text-sm mt-1">
                        Velocity: {alert.viralPotential.velocity} views/hour
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-dark-400 py-12">
              No viral reels detected yet
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;