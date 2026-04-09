"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from './layout.module.css';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/transactions', label: 'History', icon: '💸' },
  { href: '/family', label: 'Family', icon: '👨‍👩‍👧' },
  { href: '/profile', label: 'Profile', icon: '👤' }
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, initAuth, clearAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAuth();
    setMounted(true);
  }, [initAuth]);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/transactions')) return 'Transactions';
    if (pathname.includes('/family')) return 'Family';
    if (pathname.includes('/member-reports')) return 'Member Reports';
    if (pathname.includes('/profile')) return 'Profile';
    return 'App';
  };

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>{getPageTitle()}</div>
        <div className={styles.userBadge}>{user.name.charAt(0)}</div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.content}>
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`${styles.bottomNavItem} ${pathname.startsWith(item.href) ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
        {user.role === 'ADMIN' && (
          <Link 
            href="/member-reports"
            className={`${styles.bottomNavItem} ${pathname.startsWith('/member-reports') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navLabel}>Reports</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
