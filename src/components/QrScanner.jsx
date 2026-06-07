import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function QrScanner({ onScan, onError }) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  const startScanner = async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          if (UUID_REGEX.test(decodedText)) {
            onScan(decodedText);
          } else {
            onError?.('QR Code tidak valid. Pastikan QR Code berasal dari member Vector.');
          }
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      const message =
        err?.message?.includes('Permission')
          ? 'Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser.'
          : 'Gagal memulai kamera. Pastikan perangkat memiliki kamera.';
      setError(message);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        id="qr-reader"
        className={`rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-900 ${
          scanning ? 'border-2 border-surface-900 dark:border-white' : ''
        }`}
        style={{ minHeight: scanning ? 300 : 0 }}
      />

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <Button
        variant={scanning ? 'outline' : 'primary'}
        className="w-full"
        onClick={scanning ? stopScanner : startScanner}
      >
        {scanning ? (
          <>
            <CameraOff className="w-4 h-4" />
            Hentikan Scanner
          </>
        ) : (
          <>
            <Camera className="w-4 h-4" />
            Mulai Scan QR
          </>
        )}
      </Button>
    </div>
  );
}
