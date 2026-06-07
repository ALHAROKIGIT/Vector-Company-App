import { useEffect, useState } from 'react';
import { Wallet, Star, ExternalLink } from 'lucide-react';
import QRCode from 'react-qr-code';
import useStore from '../store/useStore';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import TransactionHistory from '../components/TransactionHistory';
import Onboarding from '../components/Onboarding';
import { SkeletonDashboard } from '../components/ui/SkeletonLoader';

const CANVA_TEMPLATES = [
  { title: 'Template Poster A3', url: 'https://www.canva.com/templates/?query=poster-a3' },
  { title: 'Template Tugas Kuliah', url: 'https://www.canva.com/templates/?query=college-assignment' },
  { title: 'Template Presentasi', url: 'https://www.canva.com/templates/?query=presentation' },
  { title: 'Template CV / Resume', url: 'https://www.canva.com/templates/?query=resume' },
];

export default function MemberDashboard() {
  const { profile, transactions, fetchTransactions } = useStore();
  const [txLoading, setTxLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem('vc-onboarding-done');
    if (!done) setShowOnboarding(true);
  }, []);

  useEffect(() => {
    if (profile) {
      setTxLoading(true);
      fetchTransactions(5).finally(() => setTxLoading(false));
    }
  }, [profile, fetchTransactions]);

  if (!profile) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto">
          <SkeletonDashboard />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto space-y-6 pb-20 lg:pb-6">
        {showOnboarding && (
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        )}

        <Card>
          <div className="text-center space-y-1">
            <div className="w-12 h-12 mx-auto rounded-full bg-surface-900 dark:bg-white flex items-center justify-center mb-3">
              <span className="text-white dark:text-surface-900 font-bold text-lg">
                {(profile.full_name || profile.email || '?')[0].toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              {profile.full_name || 'Member'}
            </h2>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              {profile.email}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="!p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                Vector Balance
              </span>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white tabular-nums">
              {profile.vector_balance.toLocaleString('id-ID')}
            </p>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                Vector Points
              </span>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white tabular-nums">
              {profile.vector_points.toLocaleString('id-ID')}
            </p>
          </Card>
        </div>

        <Card>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">
            QR Code Anda
          </h3>
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl">
              <QRCode
                value={profile.id}
                size={180}
                level="H"
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>
          </div>
          <p className="text-xs text-center text-surface-400 dark:text-surface-500 mt-3">
            Tunjukkan QR ini ke admin saat mencetak
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
            Galeri Template
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {CANVA_TEMPLATES.map((tpl) => (
              <a
                key={tpl.title}
                href={tpl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl border border-surface-200 dark:border-surface-800 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tpl.title}</span>
              </a>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
            Riwayat Transaksi
          </h3>
          <TransactionHistory transactions={transactions} loading={txLoading} />
        </Card>
      </div>
    </MainLayout>
  );
}
