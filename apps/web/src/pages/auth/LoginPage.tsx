import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const redirectUrl = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      setLoggedInUser(user);
      showToast(`Welcome back, ${user.name}!`, 'success');
      setShowSuccessAnim(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
      showToast(err.message || 'Login failed', 'error');
      setLoading(false);
    }
  };

  if (showSuccessAnim) {
    return (
      <LoadingScreen
        brandText="AUTHENTICATING SESSION & PREPARING DASHBOARD..."
        onComplete={() => {
          navigate(redirectUrl);
          if (loggedInUser?.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else if (loggedInUser?.role === 'VENDOR') {
            navigate('/vendor/dashboard');
          } else {
            navigate('/account');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-6 py-24">
      <div className="w-full max-w-md bg-white border border-brand-brown/15 p-8 md:p-10 rounded shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="font-serif text-4xl text-brand-gold tracking-widest block">
            SETU
          </Link>
          <span className="sub-nav-label text-brand-maroon text-[10px] block">
            BIHAR TOURISM MARKETPLACE
          </span>
          <h2 className="text-2xl font-serif text-brand-black pt-2">Sign In to Your Account</h2>
        </div>

        {/* Preset Credentials Hint */}
        <div className="mb-6 bg-cream p-3 rounded border border-brand-brown/10 text-xs font-sans text-brand-brown space-y-1">
          <div className="font-semibold text-brand-black text-[11px] sub-nav-label">DEMO ACCOUNTS:</div>
          <div>Tourist: <span className="font-mono">tourist@setu.local</span> / tourist123</div>
          <div>Vendor: <span className="font-mono">vendor@setu.local</span> / vendor123</div>
          <div>Admin: <span className="font-mono">admin@setu.local</span> / admin123</div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-sans">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          <div>
            <label className="block text-xs sub-nav-label text-brand-black/70 mb-2">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. tourist@setu.local"
              className="w-full bg-cream-light border border-brand-brown/20 rounded p-3 text-sm focus:outline-none focus:border-brand-gold text-brand-black"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sub-nav-label text-brand-black/70">PASSWORD</label>
              <a href="#" className="text-xs text-brand-maroon hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-cream-light border border-brand-brown/20 rounded p-3 text-sm focus:outline-none focus:border-brand-gold text-brand-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest rounded hover:bg-brand-maroon hover:text-white transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-brown/15 text-center text-xs font-sans text-brand-black/70">
          Don’t have an account?{' '}
          <Link to="/register" className="text-brand-maroon font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
