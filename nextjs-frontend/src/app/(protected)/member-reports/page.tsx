"use client";

import React, { useEffect, useState } from 'react';
import { familyApi, incomeApi, expenseApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import styles from './memberReports.module.css';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  user?: { id: string; name: string; };
}

export default function MemberReports() {
  const [members, setMembers] = useState<Member[]>([]);
  const [allIncomes, setAllIncomes] = useState<Transaction[]>([]);
  const [allExpenses, setAllExpenses] = useState<Transaction[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [viewType, setViewType] = useState<'summary' | 'income' | 'expense'>('summary');
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [membersRes, incomesRes, expensesRes] = await Promise.all([
        familyApi.getMembers(),
        incomeApi.getFamilyIncomes(),
        expenseApi.getFamilyExpenses(),
      ]);
      if (membersRes.data.success) setMembers(membersRes.data.data);
      if (incomesRes.data.success) setAllIncomes(incomesRes.data.data);
      if (expensesRes.data.success) setAllExpenses(expensesRes.data.data);
    } catch {
      alert('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading reports...</div>;

  if (user?.role !== 'ADMIN') {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className={styles.cardContent}>
            <h2 style={{ color: '#0f172a', marginTop: 0 }}>Access Denied</h2>
            <p style={{ color: '#64748b', marginBottom: 0 }}>Only family admins can view member reports.</p>
          </div>
        </div>
      </div>
    );
  }

  const memberStats = members.map((member) => {
    const mIncomes = allIncomes.filter((i) => i.user?.id === member.id);
    const mExpenses = allExpenses.filter((e) => e.user?.id === member.id);
    const totalIncome = mIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = mExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      member,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeCount: mIncomes.length,
      expenseCount: mExpenses.length,
    };
  });

  const getFilteredTransactions = () => {
    const transactions = viewType === 'income' ? allIncomes : allExpenses;
    if (selectedMember === 'all') return transactions;
    return transactions.filter((t) => t.user?.id === selectedMember);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.segmentGroup}>
        <button 
          className={`${styles.segmentBtn} ${viewType === 'summary' ? styles.active : ''}`}
          onClick={() => setViewType('summary')}
        >
          Summary
        </button>
        <button 
          className={`${styles.segmentBtn} ${viewType === 'income' ? styles.active : ''}`}
          onClick={() => setViewType('income')}
        >
          Incomes
        </button>
        <button 
          className={`${styles.segmentBtn} ${viewType === 'expense' ? styles.active : ''}`}
          onClick={() => setViewType('expense')}
        >
          Expenses
        </button>
      </div>

      {viewType === 'summary' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>Member Financial Summary</div>
          <div className={styles.cardContent}>
            {memberStats.map((stat) => (
              <div key={stat.member.id} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.125rem', color: '#0f172a' }}>{stat.member.name}</div>
                  <div className={styles.badge}>{stat.member.role}</div>
                </div>

                <div className={styles.memberStatsGrid}>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Income ({stat.incomeCount})</div>
                    <div className={`${styles.statValue} ${styles.statSuccess}`}>{formatCurrency(stat.totalIncome)}</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Expense ({stat.expenseCount})</div>
                    <div className={`${styles.statValue} ${styles.statDanger}`}>{formatCurrency(stat.totalExpense)}</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Balance</div>
                    <div className={`${styles.statValue} ${stat.balance >= 0 ? styles.statPrimary : styles.statWarning}`}>
                      {formatCurrency(stat.balance)}
                    </div>
                  </div>
                </div>

                <button 
                  className={styles.btnDetails}
                  onClick={() => {
                    setSelectedMember(stat.member.id);
                    setViewType('income');
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(viewType === 'income' || viewType === 'expense') && (
        <>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>Filter by Member:</label>
              <select 
                className={styles.select}
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
              >
                <option value="all">All Members</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              {viewType === 'income' ? 'Income' : 'Expense'} Records
              {selectedMember !== 'all' && ` - ${members.find(m => m.id === selectedMember)?.name}`}
            </div>
            <div className={styles.cardContent}>
              {getFilteredTransactions().length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b' }}>No {viewType} records found</div>
              ) : (
                <>
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Total Records: <strong>{getFilteredTransactions().length}</strong></span>
                      <span style={{ color: '#475569' }}>
                        Total Amount: <strong className={viewType === 'income' ? styles.statSuccess : styles.statDanger}>
                          {formatCurrency(getFilteredTransactions().reduce((sum, t) => sum + t.amount, 0))}
                        </strong>
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    {getFilteredTransactions().map(t => (
                      <div key={t.id} className={styles.listItem}>
                        <div className={styles.itemLabel}>
                          <div className={`${styles.itemAmount} ${viewType === 'income' ? styles.amountIncome : styles.amountExpense}`}>
                            {formatCurrency(t.amount)}
                          </div>
                          <div className={styles.itemMeta}>
                            <strong>{t.category}</strong> &bull; {formatDate(t.date)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                            By: {t.user?.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
