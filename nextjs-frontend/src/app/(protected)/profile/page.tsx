"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import styles from './profile.module.css';

export default function Profile() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await authApi.logout(refreshToken);
        }
      } catch (error) {
        // Ignore errors, we log out locally anyway
      } finally {
        clearAuth();
        router.push('/login');
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>User Information</div>
        <div className={styles.cardContent}>
          <div className={styles.item}>
            <div>
              <div className={styles.label}>Name</div>
              <div className={styles.value}>{user.name}</div>
            </div>
          </div>
          
          <div className={styles.item}>
            <div>
              <div className={styles.label}>Email</div>
              <div className={styles.value}>{user.email}</div>
            </div>
          </div>

          <div className={styles.item}>
            <div>
              <div className={styles.label}>Role</div>
              <div className={styles.value}>{user.role}</div>
            </div>
            <div className={`${styles.badge} ${user.role === 'ADMIN' ? styles.badgeAdmin : ''}`}>
              {user.role}
            </div>
          </div>

          <div className={styles.item}>
            <div>
              <div className={styles.label}>Family Code</div>
              <div className={styles.value}>{user.familyCode}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>About</div>
        <div className={styles.cardContent}>
          <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#0f172a' }}>Family Expense Tracker</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Version 1.0.0</p>
          <p style={{ marginTop: '1rem', color: '#475569', lineHeight: 1.5 }}>
            Track your family's income and expenses with ease. Collaborate with family members and stay on top of your finances.
          </p>
        </div>
      </div>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
