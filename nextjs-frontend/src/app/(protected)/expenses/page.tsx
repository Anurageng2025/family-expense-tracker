"use client";

import React, { useEffect, useState } from 'react';
import { expenseApi } from '@/services/api';
import styles from '../records.module.css';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Healthcare', 'Entertainment', 'Other'];

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseApi.getMyExpenses();
      if (response.data.success) {
        setExpenses(response.data.data);
      }
    } catch {
      alert('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
        notes: expense.notes || '',
      });
    } else {
      setEditingExpense(null);
      setFormData({
        amount: '',
        category: 'Food',
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
      setLoading(true);
      const payload = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes || undefined,
      };

      if (editingExpense) {
        await expenseApi.update(editingExpense.id, payload);
      } else {
        await expenseApi.create(payload);
      }
      setShowModal(false);
      fetchExpenses();
    } catch {
      alert('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        setLoading(true);
        await expenseApi.delete(id);
        fetchExpenses();
      } catch {
        alert('Failed to delete expense');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>My Expense Records</h1>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>Add Expense</button>
      </div>

      <div className={styles.card}>
        {expenses.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No expense records yet. Add your first expense!
          </div>
        ) : (
          <div className={styles.list}>
            {expenses.map((exp) => (
              <div key={exp.id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <div className={`${styles.itemAmount} ${styles.amountExpense}`}>
                    {formatCurrency(exp.amount)}
                  </div>
                  <div className={styles.itemMeta}>
                    <strong>{exp.category}</strong> &bull; {formatDate(exp.date)}
                  </div>
                  {exp.notes && <div className={styles.itemNotes}>{exp.notes}</div>}
                </div>
                <div className={styles.itemActions}>
                  <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleOpenModal(exp)}>Edit</button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(exp.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{editingExpense ? 'Edit' : 'Add'} Expense</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Amount</label>
              <input 
                type="number" 
                className={styles.input} 
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select 
                className={styles.select}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
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
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)} disabled={loading}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
