import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import AuthLayout from '../layouts/AuthLayout';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success('Akun berhasil dibuat! Silakan cek email untuk verifikasi.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        toast.success('Berhasil masuk!');
        navigate(profile?.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || 'Gagal masuk dengan Google');
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6 animate-slide-up">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {mode === 'login' ? 'Masuk' : 'Daftar'}
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {mode === 'login'
              ? 'Masuk ke akun Vector Anda'
              : 'Buat akun Vector baru'}
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleAuth}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Lanjutkan dengan Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-200 dark:border-surface-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white dark:bg-surface-950 text-surface-400">
              atau
            </span>
          </div>
        </div>

        <Card className="!p-5">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Nama Lengkap"
                icon={User}
                type="text"
                placeholder="Nama lengkap Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}
            <Input
              label="Email"
              icon={Mail}
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[2.1rem] text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              {mode === 'login' ? 'Masuk' : 'Daftar'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-surface-500 dark:text-surface-400">
          {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="font-medium text-surface-900 dark:text-white hover:underline"
          >
            {mode === 'login' ? 'Daftar' : 'Masuk'}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
