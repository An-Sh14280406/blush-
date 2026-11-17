import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E9] bg-dot-pattern flex items-center justify-center p-6 selection:bg-[#F27F9D] selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <StrawberryIcon className="w-10 h-10" />
            <span className="text-4xl font-bold font-logo text-[#C51F46]">blush.</span>
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#171316]/70">
            A Little World For Ananya ♡
          </p>
        </div>

        {/* Card */}
        <div className="relative bg-white border-2 border-[#171316] rounded-3xl p-8 shadow-scrapbook">
          <div className="absolute -top-3 right-8">
            <BowIcon className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-bold font-editorial text-[#171316] mb-1">
            Welcome back.
          </h2>
          <p className="text-xs text-[#171316]/70 mb-6">
            Sign in to check in with your body and mind today.
          </p>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-[#171316] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@blush.love"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] focus:outline-none focus:ring-2 focus:ring-[#F04478]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#171316] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] focus:outline-none focus:ring-2 focus:ring-[#F04478]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-[#F04478] text-white font-bold text-sm border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Entering blush...' : 'Sign In ♡'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-6 pt-6 border-t border-[#171316]/10 text-center">
            <p className="text-xs text-[#171316]/70">
              First time here?{' '}
              <Link to="/register" className="font-bold text-[#C51F46] hover:underline">
                Create Fresh Account ♡
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
