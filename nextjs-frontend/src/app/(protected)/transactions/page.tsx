"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { incomeApi, expenseApi, categoryApi } from '@/services/api';
import { useBookStore } from '@/store/bookStore';
import { Loader, ButtonLoader } from '@/components/Loader/Loader';
import styles from '../records.module.css';
import { Card, Badge, Button, Input, Select } from '@/components/UI';
import { 
  Plus, Search, Filter, Calendar, Tag, FileText, 
  TrendingUp, TrendingDown, Edit2, Trash2, X,
  ChevronRight, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, Download, SlidersHorizontal, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Static defaults as fallback during load
const DEFAULT_INCOME = ['Salary', 'Business', 'Investment', 'Other'];
const DEFAULT_EXPENSE = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  type: 'income' | 'expense';
}

export default function Transactions() {
  const { currentBookId } = useBookStore();
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Transaction | null>(null);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');
  
  // Filter State
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);


  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchData = async () => {
    if (!currentBookId) return;
    try {
      setLoading(true);
      const [incRes, expRes, catRes] = await Promise.all([
        incomeApi.getMyIncomes(currentBookId),
        expenseApi.getMyExpenses(currentBookId),
        categoryApi.getCategories().catch(err => {
          console.error('Categorization service unavailable, using system defaults');
          return { data: { success: true, data: [] } };
        })
      ]);

      if (incRes.data.success) {
        setIncomes(incRes.data.data.map((i: any) => ({ ...i, type: 'income' })));
      }
      if (expRes.data.success) {
        setExpenses(expRes.data.data.map((e: any) => ({ ...e, type: 'expense' })));
      }
      if (catRes.data.success) {
        setCategories(catRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentBookId]);

  const filteredTransactions = useMemo(() => {
    let combined = [...incomes, ...expenses];
    if (typeFilter !== 'all') combined = combined.filter(t => t.type === typeFilter);
    if (categoryFilter !== 'all') combined = combined.filter(t => t.category === categoryFilter);
    if (startDate) combined = combined.filter(t => new Date(t.date) >= new Date(startDate));
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      combined = combined.filter(t => new Date(t.date) <= end);
    }
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [incomes, expenses, typeFilter, categoryFilter, startDate, endDate]);

  const { totalIn, totalOut } = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === 'income') acc.totalIn += t.amount;
      else acc.totalOut += t.amount;
      return acc;
    }, { totalIn: 0, totalOut: 0 });
  }, [filteredTransactions]);

  const categoriesToDisplay = useMemo(() => {
    const incomes = categories.filter(c => c.type === 'INCOME').map(c => c.name);
    const expenses = categories.filter(c => c.type === 'EXPENSE').map(c => c.name);
    
    if (typeFilter === 'income') return incomes.length ? incomes : DEFAULT_INCOME;
    if (typeFilter === 'expense') return expenses.length ? expenses : DEFAULT_EXPENSE;
    
    const combined = Array.from(new Set([...incomes, ...expenses]));
    return combined.length ? combined : Array.from(new Set([...DEFAULT_INCOME, ...DEFAULT_EXPENSE]));
  }, [typeFilter, categories]);

  const handleOpenModal = (item?: Transaction, type: 'income' | 'expense' = 'expense') => {
    if (item) {
      setEditingItem(item);
      setModalType(item.type);
      setFormData({
        amount: item.amount.toString(),
        category: item.category,
        date: new Date(item.date).toISOString().split('T')[0],
        notes: item.notes || '',
      });
    } else {
      setEditingItem(null);
      setModalType(type);
      
      const typeCats = categories.filter(c => c.type === (type === 'income' ? 'INCOME' : 'EXPENSE'));
      const defaultOptions = type === 'income' ? DEFAULT_INCOME : DEFAULT_EXPENSE;
      const defaultCat = typeCats.length > 0 ? typeCats[0].name : defaultOptions[0];

      setFormData({
        amount: '',
        category: defaultCat,
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    // Basic validation
    const errors: Record<string, string> = {};
    if (!formData.amount) errors.amount = 'Amount is required';
    else if (parseFloat(formData.amount) <= 0) errors.amount = 'Amount must be positive';
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setActionLoading(true);
      setFieldErrors({});
      const payload = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes || undefined,
        bookId: currentBookId,
      };

      if (editingItem) {
        if (editingItem.type === 'income') await incomeApi.update(editingItem.id, payload);
        else await expenseApi.update(editingItem.id, payload);
      } else {
        if (modalType === 'income') await incomeApi.create(payload);
        else await expenseApi.create(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to save record. Please check your network.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (item: Transaction) => {
    if (confirm(`Delete this ${item.type} permanently?`)) {
      try {
        setActionLoading(true);
        if (item.type === 'income') await incomeApi.delete(item.id);
        else await expenseApi.delete(item.id);
        fetchData();
      } catch (err) {
        alert('Failed to delete transaction.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerRow}>
        <h1 className={styles.title}>History</h1>
        <Button variant="ghost" className={styles.exportBtn}>
          <Download size={16} style={{ marginRight: '8px' }} />
          Export
        </Button>
      </header>

      <Card className={styles.filterBar}>
        <div 
          className={styles.filterHeader} 
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          <div className={styles.filterTitle}>
            <SlidersHorizontal size={18} color="var(--primary)" />
            <span>Filter Transactions</span>
          </div>
          <motion.div
            animate={{ rotate: isFilterExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} color="var(--foreground-muted)" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={styles.filterContent}
            >
              <div className={styles.filterGrid}>
                <Select
                  label="Transaction Type"
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value as any); setCategoryFilter('all'); }}
                  options={[
                    { label: 'All Transactions', value: 'all' },
                    { label: 'Credits Only', value: 'income' },
                    { label: 'Debits Only', value: 'expense' }
                  ]}
                />
                <Select
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={[
                    { label: 'All Categories', value: 'all' },
                    ...categoriesToDisplay.map(cat => ({ label: cat, value: cat }))
                  ]}
                />
                <Input
                  label="Since"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="Until"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              {(typeFilter !== 'all' || categoryFilter !== 'all') && (
                <button 
                  onClick={() => { setTypeFilter('all'); setCategoryFilter('all'); }}
                  className={styles.ghostLink}
                  style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: 600 }}
                >
                  Reset Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className={styles.summaryRow}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className={`${styles.summaryCard} ${styles.summaryIncome}`}>
            <span className={styles.summaryLabel}>Total Inflow</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className={`${styles.summaryValue} ${styles.amountIncome}`}>{formatCurrency(totalIn)}</span>
              <ArrowUpRight size={16} color="var(--success)" />
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className={`${styles.summaryCard} ${styles.summaryExpense}`}>
            <span className={styles.summaryLabel}>Total Outflow</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className={`${styles.summaryValue} ${styles.amountExpense}`}>{formatCurrency(totalOut)}</span>
              <ArrowDownRight size={16} color="var(--danger)" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className={styles.card} style={{ background: 'transparent', border: 'none', padding: 0 }}>
        {loading ? (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <FileText size={40} color="var(--border)" />
            </motion.div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem', color: 'var(--border)' }}>
              <Search size={64} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No records found</h3>
            <p style={{ color: 'var(--foreground-muted)' }}>Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <motion.div 
            className={styles.list}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {filteredTransactions.map((item) => (
              <motion.div 
                key={`${item.type}-${item.id}`} 
                className={styles.listItem}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className={styles.itemInfo}>
                  <div className={`${styles.itemAmount} ${item.type === 'income' ? styles.amountIncome : styles.amountExpense}`}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </div>
                  <div className={styles.itemMeta}>
                    <Badge variant={item.type === 'income' ? 'success' : 'danger'}>
                      {item.type}
                    </Badge>
                    <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{item.category}</span>
                    <span style={{ color: 'var(--foreground-muted)' }}>&bull; {formatDate(item.date)}</span>
                  </div>
                  {item.notes && <div className={styles.itemNotes}>{item.notes}</div>}
                </div>
                <div className={styles.itemActions}>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.actionBtn} onClick={() => handleOpenModal(item)}>
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.actionBtn} onClick={() => handleDelete(item)} style={{ background: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger)' }}>
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className={styles.fabContainer}>
        <motion.button 
          className={`${styles.fab} ${styles.fabIn}`} 
          onClick={() => handleOpenModal(undefined, 'income')}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          Cash In
        </motion.button>
        <motion.button 
          className={`${styles.fab} ${styles.fabOut}`} 
          onClick={() => handleOpenModal(undefined, 'expense')}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          Cash Out
        </motion.button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className={styles.title} style={{ fontSize: '1.5rem' }}>{editingItem ? 'Edit' : 'New'} {modalType}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--foreground-muted)' }}>
                  <X size={24} />
                </button>
              </div>

              <div className={styles.form}>
                <Input
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  error={fieldErrors.amount}
                  required
                />

                <Select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={(() => {
                    const filtered = categories.filter(c => c.type === (modalType === 'income' ? 'INCOME' : 'EXPENSE'));
                    if (filtered.length > 0) {
                      return filtered.map(cat => ({ label: cat.name, value: cat.name }));
                    }
                    const defaults = modalType === 'income' ? DEFAULT_INCOME : DEFAULT_EXPENSE;
                    return defaults.map(cat => ({ label: cat, value: cat }));
                  })()}
                />

                <Input
                  label="Transaction Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />

                <Input
                  label="Notes"
                  placeholder="Optional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Button variant="ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</Button>
                  <Button onClick={handleSave} isLoading={actionLoading} style={{ flex: 2 }} variant="primary">
                    {editingItem ? 'Update Record' : 'Save Record'}
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
