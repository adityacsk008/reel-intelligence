import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reelsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaPlus, FaTrash } from 'react-icons/fa';

const ReelScanner = () => {
  const { user } = useAuth();
  const [reels, setReels] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [newReel, setNewReel] = useState({
    reelId: '',
    reelUrl: '',
    viewCount: '',
  });

  const handleAddReel = () => {
    if (!newReel.reelId || !newReel.reelUrl || !newReel.viewCount) {
      toast.error('Please fill all fields');
      return;
    }

    // Check for duplicates
    if (reels.some((r) => r.reelId === newReel.reelId)) {
      toast.error('Reel already added');
      return;
    }

    setReels([...reels, { ...newReel, viewCount: parseInt(newReel.viewCount) }]);
    setNewReel({ reelId: '', reelUrl: '', viewCount: '' });
    toast.success('Reel added to scan list');
  };

  const handleRemoveReel = (reelId) => {
    setReels(reels.filter((r) => r.reelId !== reelId));
  };

  const handleScanReels = async () => {
    if (reels.length === 0) {
      toast.error('Please add at least one reel');
      return;
    }

    setScanning(true);

    try {
      const response = await reelsAPI.scan({ reels });
      toast.success(response.data.message);
      setReels([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">🎬 Reel Scanner</h1>
            <Link to="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Reel Form */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Add Reel to Scan</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Reel ID
                </label>
                <input
                  type="text"
                  value={newReel.reelId}
                  onChange={(e) =>
                    setNewReel({ ...newReel, reelId: e.target.value })
                  }
                  className="input w-full"
                  placeholder="e.g., CXyZ123abc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Reel URL
                </label>
                <input
                  type="url"
                  value={newReel.reelUrl}
                  onChange={(e) =>
                    setNewReel({ ...newReel, reelUrl: e.target.value })
                  }
                  className="input w-full"
                  placeholder="https://instagram.com/reel/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  View Count
                </label>
                <input
                  type="number"
                  value={newReel.viewCount}
                  onChange={(e) =>
                    setNewReel({ ...newReel, viewCount: e.target.value })
                  }
                  className="input w-full"
                  placeholder="e.g., 15000"
                />
              </div>

              <button
                onClick={handleAddReel}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FaPlus /> Add to Scan List
              </button>
            </div>

            <div className="mt-6 p-4 bg-dark-700 rounded-lg">
              <p className="text-sm text-dark-300">
                <strong>Scans Remaining:</strong>{' '}
                {user?.scanLimit - user?.scansUsed} / {user?.scanLimit}
              </p>
            </div>
          </div>

          {/* Scan List */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Scan List ({reels.length})
              </h2>
              {reels.length > 0 && (
                <button
                  onClick={handleScanReels}
                  disabled={scanning}
                  className="btn-primary flex items-center gap-2"
                >
                  <FaCheckCircle />
                  {scanning ? 'Scanning...' : 'Scan All Reels'}
                </button>
              )}
            </div>

            {reels.length === 0 ? (
              <div className="text-center py-12 text-dark-400">
                <p>No reels added yet</p>
                <p className="text-sm mt-2">Add reels to start scanning</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reels.map((reel) => (
                  <div
                    key={reel.reelId}
                    className="flex items-center justify-between p-4 bg-dark-700 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{reel.reelId}</p>
                      <p className="text-dark-400 text-sm">
                        {reel.viewCount.toLocaleString()} views
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveReel(reel.reelId)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="card mt-8">
          <h2 className="text-xl font-bold text-white mb-4">📝 How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-dark-300">
            <li>Open Instagram in another tab and log in</li>
            <li>Navigate to the reel you want to analyze</li>
            <li>Copy the Reel ID from the URL</li>
            <li>Note the current view count</li>
            <li>Add the reel details in the form above</li>
            <li>Repeat for multiple reels</li>
            <li>Click "Scan All Reels" to analyze</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default ReelScanner;