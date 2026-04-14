"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { dashboardApi, incomeApi, expenseApi, categoryApi } from '@/services/api';
import { useBookStore } from '@/store/bookStore';
import { Loader, ButtonLoader } from '@/components/Loader/Loader';
import styles from './dashboard.module.css';
import { Card, Badge, Button, Input, Select } from '@/components/UI';
import { 
  TrendingUp, TrendingDown, Wallet, Scale, 
  Plus, Calendar, Tag, FileText, X, 
  Filter, Users as UsersIcon, User as UserIcon,
  ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_INCOME = ['Salary', 'Business', 'Investment', 'Gift', 'Other'];
const DEFAULT_EXPENSE = ['Food', 'Transport', 'Shopping', 'Bills', 'Healthcare', 'Entertainment', 'Other'];

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { currentBookId } = useBookStore();
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<any[]>([]);

  const fetchData = async () => {
    if (!currentBookId) return;
    try {
      setLoading(true);
      setErrorMsg('');
      const [familyRes, personalRes, catRes] = await Promise.all([
        dashboardApi.getFamilyDashboard(currentBookId),
        dashboardApi.getMyDashboard(currentBookId),
        categoryApi.getCategories().catch(err => {
          console.error('Categorization service sync failed, using defaults');
          return { data: { success: true, data: [] } };
        }),
      ]);

      if (familyRes.data.success) setFamilyData(familyRes.data.data);
      if (personalRes.data.success) setPersonalData(personalRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (error: any) {
      setErrorMsg('Failed to sync with financial records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentBookId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeCategories = useMemo(() => {
    const incomes = categories.filter(c => c.type === 'INCOME').map(c => c.name);
    const expenses = categories.filter(c => c.type === 'EXPENSE').map(c => c.name);
    
    if (fabType === 'income') return incomes.length ? incomes : DEFAULT_INCOME;
    return expenses.length ? expenses : DEFAULT_EXPENSE;
  }, [categories, fabType]);

  const handleFabSave = async () => {
    const errors: Record<string, string> = {};
    if (!fabFormData.amount) errors.amount = 'Amount is required';
    else if (parseFloat(fabFormData.amount) <= 0) errors.amount = 'Amount must be positive';
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});
      const payload = {
        amount: parseFloat(fabFormData.amount),
        category: fabFormData.category,
        date: new Date(fabFormData.date).toISOString(),
        notes: fabFormData.notes || undefined,
        bookId: currentBookId,
      };

      if (fabType === 'income') await incomeApi.create(payload);
      else await expenseApi.create(payload);
      
      setShowFabModal(false);
      setFabFormData({
        amount: '',
        category: fabType === 'income' ? (categories.find(c => c.type === 'INCOME')?.name || DEFAULT_INCOME[0]) : (categories.find(c => c.type === 'EXPENSE')?.name || DEFAULT_EXPENSE[0]),
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      fetchData();
    } catch {
      setErrorMsg(`Failed to save ${fabType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFabTypeSwitch = (type: 'expense' | 'income') => {
    setFabType(type);
    setFabFormData(prev => ({
      ...prev,
      category: type === 'income' ? (categories.find(c => c.type === 'INCOME')?.name || DEFAULT_INCOME[0]) : (categories.find(c => c.type === 'EXPENSE')?.name || DEFAULT_EXPENSE[0])
    }));
  };

  const handleOpenFab = (type: 'expense' | 'income') => {
    setFabType(type);
    setFabFormData({
      amount: '',
      category: type === 'income' ? (categories.find(c => c.type === 'INCOME')?.name || DEFAULT_INCOME[0]) : (categories.find(c => c.type === 'EXPENSE')?.name || DEFAULT_EXPENSE[0]),
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowFabModal(true);
  };

  const data = view === 'family' ? familyData : personalData;

  const incomePieData = data && Object.keys(data.incomeByCategory || {}).length > 0
    ? {
        labels: Object.keys(data.incomeByCategory || {}),
        datasets: [
          {
            data: Object.values(data.incomeByCategory || {}),
            backgroundColor: ['#4f46e5', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 10
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
            backgroundColor: ['#ef4444', '#f59e0b', '#fbbf24', '#3b82f6', '#10b981', '#64748b'],
            borderWidth: 0,
            hoverOffset: 10
          },
        ],
      }
    : null;

  const balanceBarData = data
    ? {
        labels: ['Inflow', 'Outflow', 'Net'],
        datasets: [
          {
            label: 'Amount',
            data: [data.totalIncome || 0, data.totalExpense || 0, data.balance || 0],
            backgroundColor: ['#10b981', '#ef4444', '#4f46e5'],
            borderRadius: 8,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 6, font: { size: 10 } } },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${formatCurrency(ctx.raw)}`
        }
      }
    }
  };

  if (loading && !data) {
    return (
      <div className={styles.container} style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <Wallet size={40} color="var(--primary)" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.controls}>
        <div className={styles.segmentGroup}>
          <button 
            className={`${styles.segmentBtn} ${view === 'family' ? styles.active : ''}`}
            onClick={() => setView('family')}
          >
            <UsersIcon size={14} style={{ marginRight: '0.5rem' }} />
            Family
          </button>
          <button 
            className={`${styles.segmentBtn} ${view === 'personal' ? styles.active : ''}`}
            onClick={() => setView('personal')}
          >
            <UserIcon size={14} style={{ marginRight: '0.5rem' }} />
            Personal
          </button>
        </div>
      </header>

      {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}

      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className={styles.grid}>
              <Card className={styles.statCard}>
                <div className={styles.statHeader}>
                  <div className={styles.statLabel}>Inflow</div>
                  <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className={styles.statValue}>{formatCurrency(data.totalIncome || 0)}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--success)' }}>
                  <ArrowUpRight size={12} />
                  <span>Total Earnings</span>
                </div>
              </Card>
              
              <Card className={styles.statCard}>
                <div className={styles.statHeader}>
                  <div className={styles.statLabel}>Outflow</div>
                  <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                    <TrendingDown size={20} />
                  </div>
                </div>
                <div className={styles.statValue}>{formatCurrency(data.totalExpense || 0)}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--danger)' }}>
                  <ArrowDownRight size={12} />
                  <span>Total Spending</span>
                </div>
              </Card>

              <Card className={styles.statCard}>
                <div className={styles.statHeader}>
                  <div className={styles.statLabel}>Net Balance</div>
                  <div className={styles.statIcon} style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
                    <Scale size={20} />
                  </div>
                </div>
                <div className={styles.statValue}>{formatCurrency(data.balance || 0)}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary)' }}>
                  <Wallet size={12} />
                  <span>Available Funds</span>
                </div>
              </Card>
            </div>

            <div className={styles.chartsGrid}>
              <Card className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>Financial Overview</h3>
                  <Badge variant="info">Monthly</Badge>
                </div>
                <div style={{ height: '320px' }}>
                  {balanceBarData ? (
                    <Bar data={balanceBarData} options={{...chartOptions, scales: { y: { ticks: { callback: (v: any) => v >= 1000 ? v/1000 + 'k' : v }}}}} />
                  ) : <p>No data available</p>}
                </div>
              </Card>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Card className={styles.chartCard} style={{ flex: 1 }}>
                  <div className={styles.chartHeader}>
                    <h3 className={styles.chartTitle}>Expense Mix</h3>
                  </div>
                  <div style={{ height: '240px' }}>
                    {expensePieData ? <Pie data={expensePieData} options={chartOptions} /> : <p>No expenses</p>}
                  </div>
                </Card>
              </div>
            </div>

            {view === 'family' && data.memberStats && (
              <Card className={styles.chartCard} style={{ marginTop: '1.5rem' }}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>Contribution by Member</h3>
                  <UsersIcon size={18} color="var(--foreground-muted)" />
                </div>
                <div className={styles.memberList}>
                  {data.memberStats.map((member: any) => (
                    <motion.div 
                      key={member.userId} 
                      className={styles.memberItem}
                      whileHover={{ x: 5 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className={styles.memberName}>{member.userName}</div>
                        <ChevronRight size={16} color="var(--border)" />
                      </div>
                      <div className={styles.memberStats}>
                        <div>
                          <span className={styles.memberStatLabel}>Inflow</span>
                          <div className={styles.memberStatValue} style={{ color: 'var(--success)' }}>{formatCurrency(member.income)}</div>
                        </div>
                        <div>
                          <span className={styles.memberStatLabel}>Outflow</span>
                          <div className={styles.memberStatValue} style={{ color: 'var(--danger)' }}>{formatCurrency(member.expense)}</div>
                        </div>
                        <div>
                          <span className={styles.memberStatLabel}>Net</span>
                          <div className={styles.memberStatValue} style={{ color: member.balance >= 0 ? 'var(--primary)' : 'var(--warning)' }}>
                            {formatCurrency(member.balance)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.fabContainer}>
        <motion.button 
          className={`${styles.fab} ${styles.fabIn}`} 
          onClick={() => handleOpenFab('income')}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          Cash In
        </motion.button>
        <motion.button 
          className={`${styles.fab} ${styles.fabOut}`} 
          onClick={() => handleOpenFab('expense')}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          Cash Out
        </motion.button>
      </div>

      <AnimatePresence>
        {showFabModal && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className={styles.chartTitle} style={{ fontSize: '1.5rem' }}>New Record</h2>
                <button onClick={() => setShowFabModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--foreground-muted)' }}>
                  <X size={24} />
                </button>
              </div>

              <div className={styles.typeToggle}>
                <button 
                  className={`${styles.typeBtn} ${fabType === 'expense' ? styles.activeExpense : ''}`}
                  onClick={() => handleFabTypeSwitch('expense')}
                >
                  <TrendingDown size={14} style={{ marginRight: '6px' }} />
                  Expense
                </button>
                <button 
                  className={`${styles.typeBtn} ${fabType === 'income' ? styles.activeIncome : ''}`}
                  onClick={() => handleFabTypeSwitch('income')}
                >
                  <TrendingUp size={14} style={{ marginRight: '6px' }} />
                  Income
                </button>
              </div>

              <div className={styles.form}>
                <Input
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  value={fabFormData.amount}
                  onChange={(e) => setFabFormData({ ...fabFormData, amount: e.target.value })}
                  error={fieldErrors.amount}
                  required
                />

                <Select
                  label="Category"
                  value={fabFormData.category}
                  onChange={(e) => setFabFormData({ ...fabFormData, category: e.target.value })}
                  options={(() => {
                    const filtered = categories.filter(c => c.type === (fabType === 'income' ? 'INCOME' : 'EXPENSE'));
                    if (filtered.length > 0) {
                      return filtered.map(cat => ({ label: cat.name, value: cat.name }));
                    }
                    const defaults = fabType === 'income' ? DEFAULT_INCOME : DEFAULT_EXPENSE;
                    return defaults.map(cat => ({ label: cat, value: cat }));
                  })()}
                />

                <Input
                  label="Transaction Date"
                  type="date"
                  value={fabFormData.date}
                  onChange={(e) => setFabFormData({ ...fabFormData, date: e.target.value })}
                />

                <Input
                  label="Notes"
                  placeholder="Optional details..."
                  value={fabFormData.notes}
                  onChange={(e) => setFabFormData({ ...fabFormData, notes: e.target.value })}
                />

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Button variant="ghost" onClick={() => setShowFabModal(false)} style={{ flex: 1 }}>Cancel</Button>
                  <Button onClick={handleFabSave} isLoading={loading} style={{ flex: 2 }}>Save Record</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
