import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  FaChartLine,
  FaEye,
  FaFire,
  FaVideo,
  FaSignOutAlt,
  FaUserCircle,
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getOverview();
      setAnalytics(response.data.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load analytics');
      }
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold text-white">🎬 Reel Intelligence</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-dark-300">
                <FaUserCircle className="text-xl" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <Link
              to="/dashboard"
              className="py-4 px-2 border-b-2 border-primary-500 text-white font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/scanner"
              className="py-4 px-2 border-b-2 border-transparent text-dark-400 hover:text-white transition-colors"
            >
              Reel Scanner
            </Link>
            <Link
              to="/analytics"
              className="py-4 px-2 border-b-2 border-transparent text-dark-400 hover:text-white transition-colors"
            >
              Analytics
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="py-4 px-2 border-b-2 border-transparent text-dark-400 hover:text-white transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analytics || analytics.totalReels === 0 ? (
          <div className="text-center py-12">
            <FaVideo className="text-6xl text-dark-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Reels Scanned Yet</h2>
            <p className="text-dark-400 mb-6">
              Start scanning Instagram reels to see your analytics
            </p>
            <Link to="/scanner" className="btn-primary">
              Start Scanning
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Total Reels</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {analytics.totalReels}
                    </p>
                  </div>
                  <FaVideo className="text-4xl text-primary-500" />
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Total Views</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {analytics.totalViews.toLocaleString()}
                    </p>
                  </div>
                  <FaEye className="text-4xl text-blue-500" />
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Average Views</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {analytics.averageViews.toLocaleString()}
                    </p>
                  </div>
                  <FaChartLine className="text-4xl text-green-500" />
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Viral Reels</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {analytics.viralReels} ({analytics.viralRatio}%)
                    </p>
                  </div>
                  <FaFire className="text-4xl text-orange-500" />
                </div>
              </div>
            </div>

            {/* Top Performing Reels */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                🏆 Top Performing Reels
              </h2>
              <div className="space-y-3">
                {analytics.topReels?.map((reel, index) => (
                  <div
                    key={reel.reelId}
                    className="flex items-center justify-between p-4 bg-dark-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-dark-500">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-white font-medium">
                          {reel.category} Reel
                        </p>
                        <p className="text-dark-400 text-sm">{reel.reelId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {reel.viewCount.toLocaleString()} views
                      </p>
                      <p className="text-dark-400 text-sm">
                        Quality: {reel.qualityScore}/100
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">
                📊 Category Breakdown
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(analytics.categoryBreakdown || {}).map(
                  ([category, count]) => (
                    <div key={category} className="text-center p-4 bg-dark-700 rounded-lg">
                      <p className="text-2xl font-bold text-white">{count}</p>
                      <p className="text-dark-400 text-sm mt-1">{category}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;