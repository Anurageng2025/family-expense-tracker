"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookStore } from '@/store/bookStore';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/UI';
import { Book as BookIcon, Plus, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './portal.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function BookPortal() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { books, fetchBooks, setCurrentBookId, currentBookId } = useBookStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPortal = async () => {
      await fetchBooks();
      setLoading(false);
    };
    initPortal();
  }, [fetchBooks]);

  useEffect(() => {
    // If only one book exists, skip directly to dashboard
    if (!loading && books.length === 1) {
      setCurrentBookId(books[0].id);
      router.push('/dashboard');
    }
  }, [loading, books, setCurrentBookId, router]);

  const handleSelectBook = (bookId: string) => {
    setCurrentBookId(bookId);
    router.push('/dashboard');
  };

  if (loading || (books.length === 1 && !currentBookId)) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Wallet size={48} color="var(--primary)" />
        </motion.div>
        <p style={{ marginTop: '1rem', color: 'var(--foreground-muted)' }}>Preparing your books...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>Welcome, {user?.name.split(' ')[0]}</h1>
          <p className={styles.subtitle}>Select an expense log to continue your tracking</p>
        </motion.div>
      </header>

      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {books.map((book) => (
          <motion.div key={book.id} variants={itemVariants}>
            <Card 
              className={styles.bookCard} 
              hoverable 
              onClick={() => handleSelectBook(book.id)}
            >
              <div className={styles.iconWrapper}>
                <BookIcon size={32} />
              </div>
              <div className={styles.bookName}>{book.name}</div>
              <div className={styles.bookMeta}>
                {book.isDefault ? 'Primary Account' : 'Secondary Log'}
              </div>
              <ArrowRight size={18} style={{ marginTop: 'auto', color: 'var(--primary)' }} />
            </Card>
          </motion.div>
        ))}

        <motion.div variants={itemVariants}>
          <Card 
            className={`${styles.bookCard} ${styles.addBookCard}`} 
            hoverable
            onClick={() => router.push('/profile')}
          >
            <div className={styles.iconWrapper} style={{ background: 'transparent', border: '1px dashed var(--border)' }}>
              <Plus size={32} />
            </div>
            <div className={styles.bookName}>New Book</div>
            <div className={styles.bookMeta}>Add a new project log</div>
          </Card>
        </motion.div>
      </motion.div>

      <footer style={{ marginTop: 'auto', paddingTop: '4rem', opacity: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} />
          <span>Secured Family Context</span>
        </div>
      </footer>
    </div>
  );
}
