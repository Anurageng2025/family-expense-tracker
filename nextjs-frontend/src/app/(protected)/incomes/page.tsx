"use client";

import React, { useEffect, useState } from 'react';
import { incomeApi } from '@/services/api';
import { Loader, ButtonLoader } from '@/components/Loader/Loader';
import styles from '../records.module.css';

const INCOME_CATEGORIES = ['Salary', 'Business', 'Investment', 'Gift', 'Other'];

interface Income {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export default function Incomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Salary',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await incomeApi.getMyIncomes();
      if (response.data.success) {
        setIncomes(response.data.data);
      }
    } catch {
      alert('Failed to load incomes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleOpenModal = (income?: Income) => {
    if (income) {
      setEditingIncome(income);
      setFormData({
        amount: income.amount.toString(),
        category: income.category,
        date: new Date(income.date).toISOString().split('T')[0],
        notes: income.notes || '',
      });
    } else {
      setEditingIncome(null);
      setFormData({
        amount: '',
        category: 'Salary',
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

      if (editingIncome) {
        await incomeApi.update(editingIncome.id, payload);
      } else {
        await incomeApi.create(payload);
      }
      setShowModal(false);
      fetchIncomes();
    } catch {
      alert('Failed to save income');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this income?')) {
      try {
        setLoading(true);
        await incomeApi.delete(id);
        fetchIncomes();
      } catch {
        alert('Failed to delete income');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>My Income Records</h1>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>Add Income</button>
      </div>

      <div className={styles.card}>
        {loading && incomes.length === 0 ? (
          <Loader fullPage text="Retrieving incomes..." />
        ) : incomes.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No income records yet. Add your first income!
          </div>
        ) : (
          <div className={styles.list}>
            {incomes.map((inc) => (
              <div key={inc.id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <div className={`${styles.itemAmount} ${styles.amountIncome}`}>
                    {formatCurrency(inc.amount)}
                  </div>
                  <div className={styles.itemMeta}>
                    <strong>{inc.category}</strong> &bull; {formatDate(inc.date)}
                  </div>
                  {inc.notes && <div className={styles.itemNotes}>{inc.notes}</div>}
                </div>
                <div className={styles.itemActions}>
                  <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleOpenModal(inc)}>Edit</button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(inc.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{editingIncome ? 'Edit' : 'Add'} Income</h2>

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
                {INCOME_CATEGORIES.map((cat) => (
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
              <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>{loading ? <ButtonLoader text="Saving..." /> : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
