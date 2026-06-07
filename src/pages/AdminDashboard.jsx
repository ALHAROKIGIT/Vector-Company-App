import { useState, useCallback, useEffect } from 'react';
import {
  ScanLine,
  Users,
  Trash2,
  AlertCircle,
  CheckCircle2,
  DivideCircle,
  CreditCard,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import QrScanner from '../components/QrScanner';
import TransactionHistory from '../components/TransactionHistory';

export default function AdminDashboard() {
  const { transactions, fetchAllTransactions } = useStore();
  const [mode, setMode] = useState('single');
  const [scannedMembers, setScannedMembers] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [txLoading, setTxLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setTxLoading(true);
    fetchAllTransactions(20).finally(() => setTxLoading(false));
  }, [fetchAllTransactions]);

  const handleScan = useCallback(
    async (uuid) => {
      if (scannedMembers.find((m) => m.id === uuid)) {
        toast.error('Member sudah di-scan');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, vector_balance')
        .eq('id', uuid)
        .single();

      if (error || !data) {
        toast.error('Member tidak ditemukan');
        return;
      }

      if (mode === 'single') {
        setScannedMembers([data]);
      } else {
        setScannedMembers((prev) => [...prev, data]);
      }
      toast.success(`${data.full_name || data.email} ditambahkan`);
    },
    [mode, scannedMembers]
  );

  const handleScanError = useCallback((msg) => {
    toast.error(msg);
  }, []);

  const removeMember = (id) => {
    setScannedMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const clearAll = () => {
    setScannedMembers([]);
    setTotalAmount('');
    setResults([]);
  };

  const amountPerPerson =
    scannedMembers.length > 0 && totalAmount
      ? Math.ceil(Number(totalAmount) / scannedMembers.length)
      : 0;

  const handleProcessPayment = async () => {
    const amount = Number(totalAmount);
    if (!amount || amount <= 0) {
      toast.error('Masukkan jumlah yang valid');
      return;
    }

    if (scannedMembers.length === 0) {
      toast.error('Scan minimal satu member');
      return;
    }

    const perPerson = Math.ceil(amount / scannedMembers.length);

    const insufficientMembers = scannedMembers.filter(
      (m) => m.vector_balance < perPerson
    );
    if (insufficientMembers.length > 0) {
      toast.error(
        `Saldo tidak cukup: ${insufficientMembers
          .map((m) => m.full_name || m.email)
          .join(', ')}`
      );
      return;
    }

    setProcessing(true);
    const paymentResults = [];

    for (const member of scannedMembers) {
      try {
        const { data, error } = await supabase.rpc('process_payment', {
          target_user_id: member.id,
          deduction_amount: perPerson,
        });

        if (error) throw error;

        paymentResults.push({
          id: member.id,
          name: member.full_name || member.email,
          amount: perPerson,
          success: true,
          result: data,
        });
      } catch (err) {
        paymentResults.push({
          id: member.id,
          name: member.full_name || member.email,
          amount: perPerson,
          success: false,
          error: err.message,
        });
      }
    }

    setResults(paymentResults);
    setProcessing(false);

    const successCount = paymentResults.filter((r) => r.success).length;
    if (successCount === paymentResults.length) {
      toast.success('Semua pembayaran berhasil!');
    } else {
      toast.error(`${paymentResults.length - successCount} pembayaran gagal`);
    }

    fetchAllTransactions(20);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-6">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Proses pembayaran cetak member
          </p>
        </div>

        <Card className="!p-2">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                setMode('single');
                clearAll();
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === 'single'
                  ? 'bg-surface-900 text-white dark:bg-white dark:text-surface-900'
                  : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Single
            </button>
            <button
              onClick={() => {
                setMode('split');
                clearAll();
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === 'split'
                  ? 'bg-surface-900 text-white dark:bg-white dark:text-surface-900'
                  : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <DivideCircle className="w-4 h-4" />
              Split Bill
            </button>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <ScanLine className="w-4 h-4" />
            Scan QR Member
          </h3>
          <QrScanner onScan={handleScan} onError={handleScanError} />
        </Card>

        {scannedMembers.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4" />
                Member ({scannedMembers.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Trash2 className="w-3.5 h-3.5" />
                Reset
              </Button>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {scannedMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-3 animate-slide-up"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                      {m.full_name || m.email}
                    </p>
                    <p className="text-xs text-surface-400">
                      Saldo: {m.vector_balance.toLocaleString('id-ID')}
                    </p>
                  </div>
                  {mode === 'split' && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {scannedMembers.length > 0 && (
          <Card>
            <div className="space-y-4">
              <Input
                label={mode === 'split' ? 'Total Biaya (akan dibagi rata)' : 'Jumlah Pembayaran'}
                type="number"
                min="1"
                placeholder="Masukkan jumlah"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />

              {mode === 'split' && amountPerPerson > 0 && (
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
                  <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">
                    Pembagian per orang
                  </p>
                  <p className="text-lg font-bold text-surface-900 dark:text-white tabular-nums">
                    {amountPerPerson.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-surface-400">
                      \u00d7 {scannedMembers.length} orang
                    </span>
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                loading={processing}
                onClick={handleProcessPayment}
                disabled={!totalAmount || Number(totalAmount) <= 0}
              >
                Konfirmasi Pembayaran
              </Button>
            </div>
          </Card>
        )}

        {results.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
              Hasil Pembayaran
            </h3>
            <div className="space-y-2">
              {results.map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                    r.success
                      ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400'
                  }`}
                >
                  {r.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{r.name}</p>
                    {r.success ? (
                      <p className="text-xs opacity-80">
                        -{r.amount.toLocaleString('id-ID')} Vector | +
                        {r.result?.points_earned} poin
                      </p>
                    ) : (
                      <p className="text-xs opacity-80">{r.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={clearAll}>
              Transaksi Baru
            </Button>
          </Card>
        )}

        <Card>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
            Riwayat Transaksi Terbaru
          </h3>
          <TransactionHistory transactions={transactions} loading={txLoading} />
        </Card>
      </div>
    </MainLayout>
  );
}
