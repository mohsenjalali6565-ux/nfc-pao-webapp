// 📄 app/scan/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NFCScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Please bring the NFC tag close...');
  const [error, setError] = useState('');

  useEffect(() => {
    if ('NDEFReader' in window) {
      const reader = new window.NDEFReader();

      const startScanning = async () => {
        try {
          await reader.scan();
          setStatus('Scanning...');

          reader.onreading = (event) => {
            const message = event.message;
            for (const record of message.records) {
              if (record.recordType === 'uri') {
                const decoder = new TextDecoder();
                const url = decoder.decode(record.data);
                
                const tagId = url.split('/').pop();
                if (tagId) {
                  router.push(`/p/${tagId}`);
                  setStatus('Tag found. Redirecting...');
                }
              }
            };
          };

        } catch (err: any) {
          console.error(err);
          setStatus('Error scanning NFC.');
          setError(err.message);
        }
      };

      startScanning();

      return () => {
        // reader.stop()
      };
    } else {
      setStatus('Your browser does not support Web NFC.');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">NFC Scan</h1>
      <p className="text-gray-600">{status}</p>
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}
    </div>
  );
}

