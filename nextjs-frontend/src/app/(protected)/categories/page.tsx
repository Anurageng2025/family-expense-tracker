"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { categoryApi } from '@/services/api';
import { Loader } from '@/components/Loader/Loader';
import styles from './categories.module.css';
import { Card, Button, Input, Badge } from '@/components/UI';
import { 
  Plus, Trash2, Tag, TrendingUp, TrendingDown, 
  X, ChevronRight, AlertCircle, Info, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getCategories();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const incomeCategories = useMemo(() => 
    categories.filter(c => c.type === 'INCOME'), [categories]
  );
  
  const expenseCategories = useMemo(() => 
    categories.filter(c => c.type === 'EXPENSE'), [categories]
  );

  const handleOpenModal = (type: 'INCOME' | 'EXPENSE') => {
    setModalType(type);
    setNewName('');
    setError('');
    setShowModal(true);
  };

  const handleAddCategory = async () => {
    if (!newName.trim()) return;
    
    try {
      setActionLoading(true);
      setError('');
      const res = await categoryApi.create({ 
        name: newName.trim(), 
        type: modalType 
      });
      
      if (res.data.success) {
        setShowModal(false);
        fetchCategories();
      } else {
        setError(res.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" category? This will not affect existing transactions.`)) return;
    
    try {
      setActionLoading(true);
      await categoryApi.delete(id);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Finance Classifications</h1>
        <p style={{ color: 'var(--foreground-muted)' }}>Customize how you track your family's cash inflow and outflow.</p>
      </header>

      <div className={styles.grid}>
        {/* Inflow Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <TrendingUp size={22} color="var(--success)" />
              <span>Inflow Types</span>
            </div>
            <Button size="sm" onClick={() => handleOpenModal('INCOME')}>
              <Plus size={16} /> Add
            </Button>
          </div>

          <Card>
            <div className={styles.categoryList}>
              {incomeCategories.length === 0 ? (
                <div className={styles.emptyState}>No custom inflow types yet.</div>
              ) : (
                incomeCategories.map((cat) => (
                  <div key={cat.id} className={styles.categoryItem}>
                    <div className={styles.categoryInfo}>
                      <div className={styles.iconCircle} style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>
                        <TrendingUp size={18} />
                      </div>
                      <span className={styles.categoryName}>{cat.name}</span>
                    </div>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id, cat.name)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Outflow Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <TrendingDown size={22} color="var(--danger)" />
              <span>Outflow Types</span>
            </div>
            <Button size="sm" onClick={() => handleOpenModal('EXPENSE')}>
              <Plus size={16} /> Add
            </Button>
          </div>

          <Card>
            <div className={styles.categoryList}>
              {expenseCategories.length === 0 ? (
                <div className={styles.emptyState}>No custom outflow types yet.</div>
              ) : (
                expenseCategories.map((cat) => (
                  <div key={cat.id} className={styles.categoryItem}>
                    <div className={styles.categoryInfo}>
                      <div className={styles.iconCircle} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                        <TrendingDown size={18} />
                      </div>
                      <span className={styles.categoryName}>{cat.name}</span>
                    </div>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id, cat.name)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className={styles.sectionTitle}>Add {modalType.toLowerCase()} type</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--foreground-muted)' }}>
                  <X size={24} />
                </button>
              </div>

              <div className={styles.form}>
                <Input
                  label="Classification Name"
                  placeholder="e.g. Freelancing, Groceries..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />

                {error && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.875rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <div style={{ 
                  padding: '12px', 
                  background: 'var(--background-alt)', 
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '10px',
                  fontSize: '0.8125rem',
                  color: 'var(--foreground-muted)'
                }}>
                  <Info size={24} style={{ color: 'var(--primary)' }} />
                  <span>Tip: Custom types help you get more granular reports in the dashboard.</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Button variant="ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</Button>
                  <Button onClick={handleAddCategory} isLoading={actionLoading} style={{ flex: 2 }}>
                    Create Type
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
