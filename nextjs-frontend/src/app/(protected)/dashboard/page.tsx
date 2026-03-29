"use client";

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { dashboardApi } from '@/services/api';
import styles from './dashboard.module.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [view, setView] = useState<'family' | 'personal'>('family');
  const [familyData, setFamilyData] = useState<any>(null);
  const [personalData, setPersonalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  if (loading && !data) {
    return <div>Loading dashboard...</div>;
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
                  <Bar data={balanceBarData} options={{ maintainAspectRatio: false }} />
                </div>
              ) : <p>No data</p>}
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>Income by Category</div>
              {incomePieData ? (
                <div style={{ padding: '0 2rem' }}>
                  <Pie data={incomePieData} />
                </div>
              ) : <p>No income data</p>}
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>Expense by Category</div>
              {expensePieData ? (
                <div style={{ padding: '0 2rem' }}>
                  <Pie data={expensePieData} />
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
    </div>
  );
}
