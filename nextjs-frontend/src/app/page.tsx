"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { initAuth, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAuth();
    setMounted(true);
  }, [initAuth]);

  useEffect(() => {
    if (mounted) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [mounted, isAuthenticated, router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f6f8fd' }}>
      <p style={{ color: '#64748b', fontFamily: 'Inter, sans-serif' }}>Redirecting...</p>
    </div>
  );
}
