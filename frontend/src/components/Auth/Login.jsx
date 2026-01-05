import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAdmin) {
        await adminLogin(formData.email, formData.password);
        toast.success('Admin login successful!');
        navigate('/admin');
      } else {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎬 Reel Intelligence</h1>
          <p className="text-dark-400">
            {isAdmin ? 'Admin Portal' : 'Sign in to your account'}
          </p>
        </div>

        <div className="card">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                !isAdmin
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-dark-400 hover:bg-dark-600'
              }`}
            >
              User Login
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                isAdmin
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-dark-400 hover:bg-dark-600'
              }`}
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-dark-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-dark-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {!isAdmin && (
            <div className="mt-6 text-center">
              <p className="text-dark-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-500 hover:text-primary-400">
                  Sign up
                </Link>
              </p>
            </div>
          )}

          {isAdmin && (
            <div className="mt-4 p-3 bg-dark-700 rounded-lg">
              <p className="text-xs text-dark-400">
                Default Admin: admin@reelintelligence.com / Admin@123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;