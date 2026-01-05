import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaUsers, FaVideo, FaEye, FaFire } from 'react-icons/fa';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers({ page: 1, limit: 10 }),
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data.users);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId, isActive) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !isActive });
      toast.success('User updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update user');
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
            <h1 className="text-2xl font-bold text-white">⚙️ Admin Panel</h1>
            <Link to="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats?.overview.totalUsers}
                </p>
              </div>
              <FaUsers className="text-4xl text-primary-500" />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Total Reels</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats?.overview.totalReels}
                </p>
              </div>
              <FaVideo className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats?.overview.totalViews.toLocaleString()}
                </p>
              </div>
              <FaEye className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Viral Reels</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats?.overview.viralReels}
                </p>
              </div>
              <FaFire className="text-4xl text-orange-500" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">
                    Scans Used
                  </th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-dark-700">
                    <td className="py-3 px-4 text-white">{user.name}</td>
                    <td className="py-3 px-4 text-dark-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin'
                            ? 'bg-purple-900 text-purple-300'
                            : 'bg-blue-900 text-blue-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark-300">
                      {user.scansUsed} / {user.scanLimit}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.isActive
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleUser(user._id, user.isActive)}
                        className="text-primary-500 hover:text-primary-400 text-sm"
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;