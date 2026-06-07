import { ArrowDownRight, ReceiptText } from 'lucide-react';
import { SkeletonRow } from './ui/SkeletonLoader';

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function TransactionHistory({ transactions, loading }) {
  if (loading) {
    return (
      <div className="space-y-1">
        {[...Array(3)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-surface-400 dark:text-surface-600">
        <ReceiptText className="w-10 h-10 mb-3" />
        <p className="text-sm">Belum ada transaksi</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-100 dark:divide-surface-800">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center gap-3 py-3 px-1 animate-fade-in"
        >
          <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-4 h-4 text-surface-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
              {tx.description}
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              {formatDate(tx.created_at)}
            </p>
          </div>
          <span className="text-sm font-semibold text-surface-900 dark:text-white tabular-nums">
            -{tx.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
