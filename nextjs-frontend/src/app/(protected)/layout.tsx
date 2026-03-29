"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from './layout.module.css';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/incomes', label: 'Incomes' },
  { href: '/expenses', label: 'Expenses' },
  { href: '/family', label: 'Family' },
  { href: '/profile', label: 'Profile' }
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, initAuth, clearAuth } = useAuthStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/incomes')) return 'Incomes';
    if (pathname.includes('/expenses')) return 'Expenses';
    if (pathname.includes('/family')) return 'Family';
    if (pathname.includes('/member-reports')) return 'Member Reports';
    if (pathname.includes('/profile')) return 'Profile';
    return 'App';
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          Family Tracker
        </div>
        <nav className={styles.navList}>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${pathname.startsWith(item.href) ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {user.role === 'ADMIN' && (
            <Link 
              href="/member-reports"
              className={`${styles.navItem} ${pathname.startsWith('/member-reports') ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              Member Reports
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className={`${styles.navItem} ${styles.danger}`}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', fontSize: '1rem', marginTop: '1rem' }}
          >
            Logout
          </button>
        </nav>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userEmail}>{user.email} &bull; {user.role}</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          {getPageTitle()}
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
