"use client";

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { dashboardApi, incomeApi, expenseApi } from '@/services/api';
import { Loader, ButtonLoader } from '@/components/Loader/Loader';
import styles from './dashboard.module.css';

const INCOME_CATEGORIES = ['Salary', 'Business', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Healthcare', 'Entertainment', 'Other'];


ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [view, setView] = useState<'family' | 'personal'>('family');
  const [familyData, setFamilyData] = useState<any>(null);
  const [personalData, setPersonalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showFabModal, setShowFabModal] = useState(false);
  const [fabType, setFabType] = useState<'expense' | 'income'>('expense');
  const [fabFormData, setFabFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const [familyRes, personalRes] = await Promise.all([
        dashboardApi.getFamilyDashboard(),
        dashboardApi.getMyDashboard(),
      ]);

      if (familyRes.data.success) {
        setFamilyData(familyRes.data.data);
      }
      if (personalRes.data.success) {
        setPersonalData(personalRes.data.data);
      }
    } catch (error: any) {
      setErrorMsg('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeCategories = fabType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleFabSave = async () => {
    if (!fabFormData.amount || parseFloat(fabFormData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        amount: parseFloat(fabFormData.amount),
        category: fabFormData.category,
        date: new Date(fabFormData.date).toISOString(),
        notes: fabFormData.notes || undefined,
      };

      if (fabType === 'income') {
        await incomeApi.create(payload);
      } else {
        await expenseApi.create(payload);
      }
      
      setShowFabModal(false);
      
      // Reset form default
      setFabFormData({
        amount: '',
        category: fabType === 'income' ? 'Salary' : 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });

      // Refresh dashboard data internally to reflect the new transaction instantly
      fetchData();
    } catch {
      alert(`Failed to save ${fabType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFabTypeSwitch = (type: 'expense' | 'income') => {
    setFabType(type);
    setFabFormData(prev => ({
      ...prev,
      category: type === 'income' ? 'Salary' : 'Food'
    }));
  };

  const data = view === 'family' ? familyData : personalData;

  const incomePieData = data && Object.keys(data.incomeByCategory || {}).length > 0
    ? {
        labels: Object.keys(data.incomeByCategory || {}),
        datasets: [
          {
            data: Object.values(data.incomeByCategory || {}),
            backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'],
          },
        ],
      }
    : null;

  const expensePieData = data && Object.keys(data.expenseByCategory || {}).length > 0
    ? {
        labels: Object.keys(data.expenseByCategory || {}),
        datasets: [
          {
            data: Object.values(data.expenseByCategory || {}),
            backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#64748b'],
          },
        ],
      }
    : null;

  const balanceBarData = data
    ? {
        labels: ['Income', 'Expense', 'Balance'],
        datasets: [
          {
            label: 'Amount',
            data: [data.totalIncome || 0, data.totalExpense || 0, data.balance || 0],
            backgroundColor: ['#10b981', '#ef4444', '#3b82f6'],
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== undefined) {
              label += formatCurrency(context.parsed.y);
            } else if (context.parsed !== undefined) {
              label += formatCurrency(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        ticks: {
          callback: (value: any) => formatCurrency(value)
        }
      }
    }
  };

  if (loading && !data) {
    return <Loader fullPage size="large" text="Analyzing dashboard data..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.segmentGroup}>
          <button 
            className={`${styles.segmentBtn} ${view === 'family' ? styles.active : ''}`}
            onClick={() => setView('family')}
          >
            Family
          </button>
          <button 
            className={`${styles.segmentBtn} ${view === 'personal' ? styles.active : ''}`}
            onClick={() => setView('personal')}
          >
            Personal
          </button>
        </div>
      </div>

      {errorMsg && <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMsg}</div>}

      {data && (
        <>
          <div className={styles.grid}>
            <div className={`${styles.card} ${styles.success}`}>
              <div className={styles.cardTitle}>Total Income</div>
              <div className={styles.cardValue}>{formatCurrency(data.totalIncome || 0)}</div>
            </div>
            
            <div className={`${styles.card} ${styles.danger}`}>
              <div className={styles.cardTitle}>Total Expense</div>
              <div className={styles.cardValue}>{formatCurrency(data.totalExpense || 0)}</div>
            </div>

            <div className={`${styles.card} ${data.balance >= 0 ? styles.primary : styles.warning}`}>
              <div className={styles.cardTitle}>Balance</div>
              <div className={styles.cardValue}>{formatCurrency(data.balance || 0)}</div>
            </div>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
              <div className={styles.chartHeader}>Overview</div>
              {balanceBarData ? (
                <div style={{ height: '300px' }}>
                  <Bar data={balanceBarData} options={barOptions} />
                </div>
              ) : <p>No data</p>}
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>Income by Category</div>
              {incomePieData ? (
                <div style={{ padding: '0 2rem' }}>
                  <Pie data={incomePieData} options={chartOptions} />
                </div>
              ) : <p>No income data</p>}
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>Expense by Category</div>
              {expensePieData ? (
                <div style={{ padding: '0 2rem' }}>
                  <Pie data={expensePieData} options={chartOptions} />
                </div>
              ) : <p>No expense data</p>}
            </div>
          </div>

          {view === 'family' && familyData?.memberStats && (
            <div className={styles.chartCard} style={{ marginTop: '1.5rem' }}>
              <div className={styles.chartHeader}>Member Breakdown</div>
              <div className={styles.memberList}>
                {familyData.memberStats.map((member: any) => (
                  <div key={member.userId} className={styles.memberItem}>
                    <div className={styles.memberName}>{member.userName}</div>
                    <div className={styles.memberStats}>
                      <div className={styles.memberStat}>
                        <span className={styles.memberStatLabel}>Income</span>
                        <strong style={{ color: '#10b981' }}>{formatCurrency(member.income)}</strong>
                      </div>
                      <div className={styles.memberStat}>
                        <span className={styles.memberStatLabel}>Expense</span>
                        <strong style={{ color: '#ef4444' }}>{formatCurrency(member.expense)}</strong>
                      </div>
                      <div className={styles.memberStat}>
                        <span className={styles.memberStatLabel}>Balance</span>
                        <strong style={{ color: member.balance >= 0 ? '#3b82f6' : '#f59e0b' }}>
                          {formatCurrency(member.balance)}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <button className={styles.fab} onClick={() => setShowFabModal(true)} title="Add Transaction">
        <span>+</span>
      </button>

      {/* FAB Modal */}
      {showFabModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Add Transaction</h2>

            <div className={styles.typeToggle}>
              <button 
                className={`${styles.typeBtn} ${fabType === 'expense' ? styles.activeExpense : ''}`}
                onClick={() => handleFabTypeSwitch('expense')}
              >
                Expense
              </button>
              <button 
                className={`${styles.typeBtn} ${fabType === 'income' ? styles.activeIncome : ''}`}
                onClick={() => handleFabTypeSwitch('income')}
              >
                Income
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Amount</label>
              <input
                type="number"
                className={styles.input}
                value={fabFormData.amount}
                onChange={(e) => setFabFormData({ ...fabFormData, amount: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                className={styles.select}
                value={fabFormData.category}
                onChange={(e) => setFabFormData({ ...fabFormData, category: e.target.value })}
              >
                {activeCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                className={styles.input}
                value={fabFormData.date}
                onChange={(e) => setFabFormData({ ...fabFormData, date: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Notes (Optional)</label>
              <input
                type="text"
                className={styles.input}
                value={fabFormData.notes}
                onChange={(e) => setFabFormData({ ...fabFormData, notes: e.target.value })}
                placeholder="What was this for?"
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowFabModal(false)} disabled={loading}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleFabSave} disabled={loading}>
                {loading ? <ButtonLoader text="Saving..." /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
