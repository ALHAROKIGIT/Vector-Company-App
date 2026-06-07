import { useState, useCallback } from 'react';
import { X, Volume2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import Button from './ui/Button';

const STEPS = [
  {
    title: 'Selamat Datang di Vector!',
    body: 'Vector Company adalah platform membership layanan cetak eksklusif untuk mahasiswa. Nikmati kemudahan cetak dengan sistem saldo digital.',
    speech: 'Selamat datang di Vector Company! Kami adalah platform membership layanan cetak eksklusif untuk mahasiswa.',
  },
  {
    title: 'Vector Balance',
    body: 'Saldo digital Anda untuk membayar layanan cetak. Top-up saldo melalui admin, lalu gunakan untuk mencetak dokumen dengan mudah.',
    speech: 'Vector Balance adalah saldo digital Anda. Top up melalui admin, lalu gunakan untuk membayar layanan cetak.',
  },
  {
    title: 'Vector Points',
    body: 'Setiap transaksi memberikan 5% poin reward. Kumpulkan poin dan tukarkan dengan benefit eksklusif di masa depan!',
    speech: 'Setiap transaksi memberikan 5 persen poin reward. Kumpulkan dan tukarkan dengan benefit eksklusif!',
  },
  {
    title: 'QR Code Anda',
    body: 'Tunjukkan QR Code di dashboard Anda ke admin saat akan mencetak. Cepat, aman, dan tanpa ribet.',
    speech: 'Tunjukkan QR Code Anda ke admin saat akan mencetak. Cepat, aman, dan tanpa ribet. Selamat menggunakan Vector!',
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      window.speechSynthesis?.cancel();
      localStorage.setItem('vc-onboarding-done', 'true');
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClose = () => {
    window.speechSynthesis?.cancel();
    localStorage.setItem('vc-onboarding-done', 'true');
    onComplete();
  };

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-md p-8 relative animate-slide-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step indicator */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                i <= step
                  ? 'bg-surface-900 dark:bg-white'
                  : 'bg-surface-200 dark:bg-surface-800'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-surface-900 dark:text-white" />
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
              {current.title}
            </h2>
          </div>
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
            {current.body}
          </p>
        </div>

        {/* Voice button */}
        <button
          onClick={() => speak(current.speech)}
          disabled={speaking}
          className={`flex items-center gap-2 text-sm mb-6 px-3 py-1.5 rounded-lg transition-all ${
            speaking
              ? 'text-surface-900 dark:text-white bg-surface-100 dark:bg-surface-800'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${speaking ? 'animate-pulse' : ''}`} />
          {speaking ? 'Sedang berbicara...' : 'Dengarkan'}
        </button>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={step === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </Button>
          <Button size="sm" onClick={handleNext}>
            {step < STEPS.length - 1 ? (
              <>
                Lanjut
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              'Mulai Sekarang'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
