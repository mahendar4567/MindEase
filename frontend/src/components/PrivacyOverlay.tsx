import React, { useState } from 'react';
import { privacyService } from '../services/privacyService';
import { useAuth } from '../context/AuthContext';
import { Lock, EyeOff, LogOut, AlertCircle } from 'lucide-react';

interface PrivacyOverlayProps {
  isPrivate: boolean;
  onUnlock: () => void;
}

export const PrivacyOverlay: React.FC<PrivacyOverlayProps> = ({ isPrivate, onUnlock }) => {
  const { logout } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isPrivate) return null;

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pin || pin.length < 4) {
      setError('Please enter your 4-digit PIN');
      return;
    }

    try {
      setLoading(true);
      await privacyService.verifyPin(pin);
      setPin('');
      onUnlock();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Incorrect PIN. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl text-white">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto shadow-lg">
          <EyeOff className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Privacy Mode Active</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sensitive wellness records are hidden on this screen.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Enter Privacy PIN
            </label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="block w-full text-center tracking-widest text-xl font-bold py-3 bg-slate-900 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-600"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm shadow-md transition-all"
            >
              {loading ? 'Verifying PIN...' : 'Unlock Screen'}
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-slate-700/60 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 font-semibold text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" /> Quick Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrivacyOverlay;
