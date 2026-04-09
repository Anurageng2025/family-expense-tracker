"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { incomeApi, expenseApi } from '@/services/api';
import { Loader, ButtonLoader } from '@/components/Loader/Loader';
import styles from '../records.module.css';

const INCOME_CATEGORIES = ['Salary', 'Business', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Healthcare', 'Entertainment', 'Other'];

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  type: 'income' | 'expense';
}

export default function Transactions() {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
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


  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incRes, expRes] = await Promise.all([
        incomeApi.getMyIncomes(),
        expenseApi.getMyExpenses()
      ]);

      if (incRes.data.success) {
        setIncomes(incRes.data.data.map((i: any) => ({ ...i, type: 'income' })));
      }
      if (expRes.data.success) {
        setExpenses(expRes.data.data.map((e: any) => ({ ...e, type: 'expense' })));
      }
    } catch (err) {
      alert('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Combined and Filtered List
  const filteredTransactions = useMemo(() => {
    let combined = [...incomes, ...expenses];

    // Filter by Type
    if (typeFilter !== 'all') {
      combined = combined.filter(t => t.type === typeFilter);
    }

    // Filter by Category
    if (categoryFilter !== 'all') {
      combined = combined.filter(t => t.category === categoryFilter);
    }

    // Filter by Date
    if (startDate) {
      combined = combined.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      combined = combined.filter(t => new Date(t.date) <= end);
    }

    // Sort by Date Descending
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

    if (typeFilter === 'income') return INCOME_CATEGORIES;
    if (typeFilter === 'expense') return EXPENSE_CATEGORIES;
    return Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));
  }, [typeFilter]);

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
      setFormData({
        amount: '',
        category: type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
      setActionLoading(true);
      const payload = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes || undefined,
      };

      if (editingItem) {
        if (editingItem.type === 'income') {
          await incomeApi.update(editingItem.id, payload);
        } else {
          await expenseApi.update(editingItem.id, payload);
        }
      } else {
        if (modalType === 'income') {
          await incomeApi.create(payload);
        } else {
          await expenseApi.create(payload);
        }
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to save transaction');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (item: Transaction) => {
    if (confirm(`Are you sure you want to delete this ${item.type}?`)) {
      try {
        setActionLoading(true);
        if (item.type === 'income') {
          await incomeApi.delete(item.id);
        } else {
          await expenseApi.delete(item.id);
        }
        fetchData();
      } catch (err) {
        alert('Failed to delete transaction');
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
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Transactions</h1>
      </div>

      <div className={styles.summaryRow}>
        <div className={`${styles.summaryCard} ${styles.summaryIncome}`}>
          <span className={styles.summaryLabel}>Total Cash In</span>
          <span className={`${styles.summaryValue} ${styles.amountIncome}`}>{formatCurrency(totalIn)}</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryExpense}`}>
          <span className={styles.summaryLabel}>Total Cash Out</span>
          <span className={`${styles.summaryValue} ${styles.amountExpense}`}>{formatCurrency(totalOut)}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <label className={styles.label}>Type</label>
            <select className={styles.select} value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as any); setCategoryFilter('all'); }}>
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categoriesToDisplay.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.label}>From</label>
            <input type="date" className={styles.input} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className={styles.label}>To</label>
            <input type="date" className={styles.input} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        {(typeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate) && (
          <button 
            onClick={() => { setTypeFilter('all'); setCategoryFilter('all'); setStartDate(''); setEndDate(''); }}
            style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className={styles.card}>
        {loading ? (
          <Loader fullPage text="Syncing transactions..." />
        ) : filteredTransactions.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No transactions found for the selected filters.
          </div>
        ) : (
          <div className={styles.list}>
            {filteredTransactions.map((item) => (
              <div key={`${item.type}-${item.id}`} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <div className={`${styles.itemAmount} ${item.type === 'income' ? styles.amountIncome : styles.amountExpense}`}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </div>
                  <div className={styles.itemMeta}>
                    <span style={{ 
                      display: 'inline-block', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      background: item.type === 'income' ? '#dcfce7' : '#fee2e2',
                      color: item.type === 'income' ? '#166534' : '#991b1b',
                      marginRight: '0.5rem',
                      textTransform: 'capitalize'
                    }}>
                      {item.type}
                    </span>
                    <strong>{item.category}</strong> &bull; {formatDate(item.date)}
                  </div>
                  {item.notes && <div className={styles.itemNotes}>{item.notes}</div>}
                </div>
                <div className={styles.itemActions}>
                  <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleOpenModal(item)}>Edit</button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(item)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className={styles.fabContainer}>
        <button className={`${styles.fab} ${styles.fabIn}`} onClick={() => handleOpenModal(undefined, 'income')}>
          <span>💰</span> Cash In
        </button>
        <button className={`${styles.fab} ${styles.fabOut}`} onClick={() => handleOpenModal(undefined, 'expense')}>
          <span>💸</span> Cash Out
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <label className={styles.label}>Type</label>
            <select className={styles.select} value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as any); setCategoryFilter('all'); }}>
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categoriesToDisplay.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.label}>From</label>
            <input type="date" className={styles.input} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className={styles.label}>To</label>
            <input type="date" className={styles.input} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        {(typeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate) && (
          <button 
            onClick={() => { setTypeFilter('all'); setCategoryFilter('all'); setStartDate(''); setEndDate(''); }}
            style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className={styles.card}>
        {loading ? (
          <Loader fullPage text="Syncing transactions..." />
        ) : filteredTransactions.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No transactions found for the selected filters.
          </div>
        ) : (
          <div className={styles.list}>
            {filteredTransactions.map((item) => (
              <div key={`${item.type}-${item.id}`} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <div className={`${styles.itemAmount} ${item.type === 'income' ? styles.amountIncome : styles.amountExpense}`}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </div>
                  <div className={styles.itemMeta}>
                    <span style={{ 
                      display: 'inline-block', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      background: item.type === 'income' ? '#dcfce7' : '#fee2e2',
                      color: item.type === 'income' ? '#166534' : '#991b1b',
                      marginRight: '0.5rem',
                      textTransform: 'capitalize'
                    }}>
                      {item.type}
                    </span>
                    <strong>{item.category}</strong> &bull; {formatDate(item.date)}
                  </div>
                  {item.notes && <div className={styles.itemNotes}>{item.notes}</div>}
                </div>
                <div className={styles.itemActions}>
                  <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleOpenModal(item)}>Edit</button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(item)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{editingItem ? 'Edit' : 'Add'} {modalType}</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Amount</label>
              <input
                type="number"
                className={styles.input}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                className={styles.select}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {(modalType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                className={styles.input}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Notes (Optional)</label>
              <input
                type="text"
                className={styles.input}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="What was this for?"
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)} disabled={actionLoading}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={actionLoading} style={{ background: modalType === 'income' ? '#10b981' : '#3b82f6' }}>
                {actionLoading ? <ButtonLoader text="Saving..." /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
