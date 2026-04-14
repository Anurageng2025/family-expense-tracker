"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBookStore } from '@/store/bookStore';
import { authApi } from '@/services/api';
import styles from './profile.module.css';
import { Card, Badge, Button, Input } from '@/components/UI';
import { 
  User as UserIcon, Mail, Shield, Hash, 
  Book, LogOut, Info, Plus, Home,
  CheckCircle2, AlertCircle, ChevronRight, Tag
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, clearAuth } = useAuthStore();
  const { books, createBook, isLoading } = useBookStore();
  const [newBookName, setNewBookName] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) await authApi.logout(refreshToken);
      } catch (error) {
        // Silent fail
      } finally {
        clearAuth();
        router.push('/login');
      }
    }
  };

  const handleCreateBook = async () => {
    if (!newBookName.trim()) return;
    try {
      setIsCreating(true);
      await createBook(newBookName);
      setNewBookName('');
    } catch (error) {
      alert('Failed to create book');
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <div className={styles.statIcon} style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
              <UserIcon size={24} />
            </div>
            <h2 className={styles.cardTitle}>Identity & Security</h2>
          </div>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Full Name</div>
              <div className={styles.value}>{user.name}</div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.label}>Email Address</div>
              <div className={styles.value}>{user.email}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.label}>Access Level</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.value}>{user.role}</span>
                <Badge variant={user.role === 'ADMIN' ? 'success' : 'info'}>
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.label}>Family Identification</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
                <Hash size={14} />
                <span>{user.familyCode}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: '12px' }}>
              <Book size={24} />
            </div>
            <h2 className={styles.cardTitle}>Financial Accounts</h2>
          </div>

          <div className={styles.bookList}>
            {books.map((book) => (
              <motion.div 
                key={book.id} 
                className={styles.bookItem}
                whileHover={{ x: 5 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.5rem', background: 'var(--input)', borderRadius: '10px' }}>
                    {book.isDefault ? <Home size={18} color="var(--primary)" /> : <Book size={18} color="var(--foreground-muted)" />}
                  </div>
                  <div>
                    <div className={styles.bookName}>{book.name}</div>
                    {book.isDefault && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Active Workspace</span>}
                  </div>
                </div>
                <ChevronRight size={16} color="var(--border)" />
              </motion.div>
            ))}
          </div>

          <div className={styles.addBookSection}>
            <Input 
              placeholder="e.g. Wedding, Travel"
              value={newBookName}
              onChange={(e) => setNewBookName(e.target.value)}
              disabled={isCreating}
              style={{ marginBottom: 0 }}
            />
            <Button 
              onClick={handleCreateBook}
              isLoading={isCreating}
              disabled={!newBookName.trim()}
              variant="primary"
            >
              Initialize Book
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <div className={styles.statIcon} style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#059669', padding: '0.75rem', borderRadius: '12px' }}>
              <Tag size={24} />
            </div>
            <h2 className={styles.cardTitle}>Custom Classifications</h2>
          </div>
          
          <p style={{ margin: '0 0.5rem 1.5rem', color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>
            Personalize your cashbook by defining your own family-specific inflow and outflow categories.
          </p>

          <Button 
            onClick={() => router.push('/categories')}
            variant="ghost"
            style={{ width: '100%', justifyContent: 'space-between', padding: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Tag size={18} />
              <span>Manage Categories</span>
            </div>
            <ChevronRight size={16} />
          </Button>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className={styles.profileCard} style={{ background: 'rgba(79, 70, 229, 0.05)', borderColor: 'rgba(79, 70, 229, 0.1)' }}>
          <div className={styles.cardHeader}>
            <div className={styles.statIcon} style={{ background: 'white', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
              <Info size={24} />
            </div>
            <h2 className={styles.cardTitle}>System Information</h2>
          </div>
          <div style={{ padding: '0 0.5rem' }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 800 }}>Expansis Track v1.2</h3>
            <p style={{ margin: 0, color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>
              Built for high-performance family financial collaboration. Your data is encrypted and synced in real-time.
            </p>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          Terminate Session
        </button>
      </motion.div>
    </motion.div>
  );
}
