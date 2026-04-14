'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/services/db';
import { RefreshCw, CloudOff, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './SyncStatus.module.css';

export default function SyncStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const pendingCount = useLiveQuery(() => db.queued_requests.count()) || 0;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const updateOnline = () => setIsOnline(navigator.onLine);
      window.addEventListener('online', updateOnline);
      window.addEventListener('offline', updateOnline);
      return () => {
        window.removeEventListener('online', updateOnline);
        window.removeEventListener('offline', updateOnline);
      };
    }
  }, []);

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className={`${styles.container} ${!isOnline ? styles.offline : styles.syncing}`}>
      {!isOnline ? (
        <>
          <CloudOff size={14} />
          <span>Offline Mode</span>
        </>
      ) : (
        <>
          <RefreshCw size={14} className={styles.spin} />
          <span>{pendingCount} item{pendingCount > 1 ? 's' : ''} syncing...</span>
        </>
      )}
    </div>
  );
}
