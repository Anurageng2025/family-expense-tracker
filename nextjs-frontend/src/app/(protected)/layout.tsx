"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBookStore } from '@/store/bookStore';
import { LayoutDashboard, History, Users, User, BarChart3, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './layout.module.css';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', Icon: History },
  { href: '/family', label: 'Family', Icon: Users },
  { href: '/profile', label: 'Profile', Icon: User }
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, initAuth } = useAuthStore();
  const { books, currentBookId, fetchBooks, setCurrentBookId } = useBookStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAuth();
    setMounted(true);
  }, [initAuth]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchBooks();
    }
  }, [mounted, isAuthenticated, fetchBooks]);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // If we are on the root portal, we don't want to show the header/nav in some cases, 
  // but for now, we'll just refine the header.
  const isPortal = pathname === '/';

  if (!mounted || !user) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--background)'
      }}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <LayoutDashboard size={40} color="var(--primary)" />
        </motion.div>
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/transactions')) return 'History';
    if (pathname.includes('/family')) return 'Family';
    if (pathname.includes('/member-reports')) return 'Reports';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname === '/') return 'Expansis';
    return 'App';
  };

  const activeBook = books.find(b => b.id === currentBookId);

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitle}>{getPageTitle()}</div>
          {books.length > 0 && !isPortal && (
            <div className={styles.bookSwitcherWrapper}>
              <select 
                className={styles.bookSwitcher}
                value={currentBookId || ''}
                onChange={(e) => setCurrentBookId(e.target.value)}
              >
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                ))}
              </select>
              <ChevronDown className={styles.switcherIcon} size={14} />
            </div>
          )}
        </div>
        <motion.div 
          className={styles.userBadge}
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push('/profile')}
        >
          {user.name.charAt(0)}
        </motion.div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.bottomNavItem} ${isActive ? styles.active : ''}`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={styles.navIconWrapper}
              >
                <item.Icon size={20} />
                {isActive && (
                  <motion.div 
                    layoutId="navBubble"
                    className={styles.navBubble}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
        {user.role === 'ADMIN' && (
          <Link 
            href="/member-reports"
            className={`${styles.bottomNavItem} ${pathname.startsWith('/member-reports') ? styles.active : ''}`}
          >
            <div className={styles.navIconWrapper}>
              <BarChart3 size={20} />
            </div>
            <span className={styles.navLabel}>Reports</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
