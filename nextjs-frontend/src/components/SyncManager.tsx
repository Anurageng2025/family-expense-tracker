'use client';

import { useEffect } from 'react';
import { db } from '@/services/db';
import axios from 'axios';

export default function SyncManager() {
  useEffect(() => {
    const handleSync = async () => {
      if (!navigator.onLine) return;

      const queued = await db.queued_requests
        .where('status')
        .equals('pending')
        .toArray();

      if (queued.length === 0) return;

      console.log(`🔄 SyncManager: Replaying ${queued.length} queued requests...`);

      for (const request of queued) {
        try {
          await db.queued_requests.update(request.id!, { status: 'processing' });

          // Replay the request
          await axios({
            url: request.url,
            method: request.method,
            data: request.data,
            headers: {
              ...request.headers,
              // Ensure we use the latest token from localStorage if needed, 
              // but the interceptor in api.ts usually handles it.
              // Here we use a clean axios instance to avoid recursive offline intercepting.
            }
          });

          await db.queued_requests.delete(request.id!);
          console.log(`✅ SyncManager: Successfully synced request ${request.id}`);
        } catch (error: any) {
          console.error(`❌ SyncManager: Failed to sync request ${request.id}`, error);
          
          await db.queued_requests.update(request.id!, { 
            status: 'failed',
            error: error.message,
            retryCount: request.retryCount + 1
          });
          
          // If it's a 4xx error (except 429), maybe we should stop retrying?
          // For now, we just mark as failed and continue to next.
        }
      }
    };

    // Initial sync check
    if (typeof window !== 'undefined') {
      handleSync();
      window.addEventListener('online', handleSync);
      return () => window.removeEventListener('online', handleSync);
    }
  }, []);

  return null; // This component doesn't render anything
}
