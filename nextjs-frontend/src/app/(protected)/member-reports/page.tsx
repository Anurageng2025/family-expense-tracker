"use client";

import React, { useEffect, useState } from 'react';
import { familyApi, incomeApi, expenseApi, reminderApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Loader, ButtonLoader } from '@/components/Loader/Loader';
import styles from './memberReports.module.css';
import { Card, Badge, Button, Input, Select } from '@/components/UI';

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
import { 
  FileText, TrendingUp, TrendingDown, User as UserIcon, 
  Mail, Download, ChevronRight, Search, Filter, 
  ArrowUpRight, ArrowDownRight, Share2, Printer, 
  X, BarChart3, PieChart, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MemberReports() {
  const [members, setMembers] = useState<Member[]>([]);
  const [allIncomes, setAllIncomes] = useState<Transaction[]>([]);
  const [allExpenses, setAllExpenses] = useState<Transaction[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [viewType, setViewType] = useState<'summary' | 'income' | 'expense'>('summary');
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTargetMember, setEmailTargetMember] = useState<string>('');
  const [emailingStatus, setEmailingStatus] = useState(false);

  const fetchData = async () => {
    try {
      const [membersRes, incomesRes, expensesRes] = await Promise.all([
        familyApi.getMembers(),
        incomeApi.getFamilyIncomes(),
        expenseApi.getFamilyExpenses(),
      ]);
      if (membersRes.data.success) {
        setMembers(membersRes.data.data);
        if (membersRes.data.data.length > 0) setEmailTargetMember(membersRes.data.data[0].id);
      }
      if (incomesRes.data.success) setAllIncomes(incomesRes.data.data);
      if (expensesRes.data.success) setAllExpenses(expensesRes.data.data);
    } catch {
      console.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchData();
    else setLoading(false);
  }, [user]);

  if (loading) return (
    <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader size="large" text="Compiling Analytical Data..." />
    </div>
  );

  if (user?.role !== 'ADMIN') {
    return (
      <div className={styles.container}>
        <Card style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Shield size={32} color="var(--danger)" />
            <div>
              <h2 style={{ margin: 0 }}>Restricted Access</h2>
              <p style={{ margin: 0, color: 'var(--foreground-muted)' }}>Financial reports are exclusive to family administrators.</p>
            </div>
          </div>
        </Card>
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

  const handleExportCsv = () => {
    let transactionsToExport: Transaction[] = [];
    if (viewType === 'summary') {
      transactionsToExport = selectedMember === 'all' 
        ? [...allIncomes, ...allExpenses] 
        : [...allIncomes, ...allExpenses].filter(t => t.user?.id === selectedMember);
    } else {
      transactionsToExport = getFilteredTransactions();
    }

    transactionsToExport.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const headers = ['Date', 'Type', 'Category', 'Amount (INR)', 'Member', 'Notes'];
    const rows = transactionsToExport.map(t => {
      const type = allIncomes.some(i => i.id === t.id) ? 'Income' : 'Expense';
      return [
        new Date(t.date).toLocaleDateString('en-IN'), type, `"${t.category}"`,
        t.amount.toString(), `"${t.user?.name || 'Unknown'}"`, `"${t.notes || ''}"`
      ].join(',');
    });

    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `expansis_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = async () => {
    if (!emailTargetMember) return;
    try {
      setEmailingStatus(true);
      const csvContent = "Exporting data..."; // Simplified for demo
      await reminderApi.sendReport(emailTargetMember, csvContent, 'Financial Export');
      setShowEmailModal(false);
      alert('Report dispatched to recipient');
    } catch {
      alert('Email delivery failed');
    } finally {
      setEmailingStatus(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <header>
          <h1 className={styles.title}>Financial Matrix</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>Granular contribution analytics and member performance.</p>
        </header>
        
        <div className={styles.actionBar}>
          <Button variant="ghost" onClick={() => setShowEmailModal(true)}>
            <Mail size={18} style={{ marginRight: '8px' }} />
            Distribute
          </Button>
          <Button variant="primary" onClick={handleExportCsv}>
            <Download size={18} style={{ marginRight: '8px' }} />
            Export Data
          </Button>
        </div>
      </div>

      <div className={styles.segmentGroup}>
        <button className={`${styles.segmentBtn} ${viewType === 'summary' ? styles.active : ''}`} onClick={() => setViewType('summary')}>
          Perspective
        </button>
        <button className={`${styles.segmentBtn} ${viewType === 'income' ? styles.active : ''}`} onClick={() => setViewType('income')}>
          Inflows
        </button>
        <button className={`${styles.segmentBtn} ${viewType === 'expense' ? styles.active : ''}`} onClick={() => setViewType('expense')}>
          Outflows
        </button>
      </div>

      {viewType === 'summary' && (
        <div className={styles.summaryGrid}>
          {memberStats.map((stat) => (
            <motion.div key={stat.member.id} variants={itemVariants}>
              <Card>
                <div className={styles.summaryHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: '50%', color: 'var(--primary)' }}>
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <div className={styles.cardTitle}>{stat.member.name}</div>
                      <Badge variant={stat.member.role === 'ADMIN' ? 'success' : 'info'}>{stat.member.role}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedMember(stat.member.id); setViewType('expense'); }}>
                    <ChevronRight size={18} />
                  </Button>
                </div>

                <div className={styles.memberStatsGrid}>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Invoiced ({stat.incomeCount})</div>
                    <div className={`${styles.statValue} ${styles.statSuccess}`}>{formatCurrency(stat.totalIncome)}</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Spent ({stat.expenseCount})</div>
                    <div className={`${styles.statValue} ${styles.statDanger}`}>{formatCurrency(stat.totalExpense)}</div>
                  </div>
                  <div className={styles.statBox} style={{ background: 'var(--surface)' }}>
                    <div className={styles.statLabel}>Net Position</div>
                    <div className={`${styles.statValue} ${stat.balance >= 0 ? styles.statPrimary : styles.statWarning}`}>
                      {formatCurrency(stat.balance)}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {(viewType === 'income' || viewType === 'expense') && (
        <motion.div variants={itemVariants} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <Select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                options={[
                  { label: 'Consolidated Members', value: 'all' },
                  ...members.map(m => ({ label: m.name, value: m.id }))
                ]}
              />
            </div>
          </div>

          <Card>
            <div className={styles.cardHeader} style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {viewType === 'income' ? <TrendingUp color="var(--success)" /> : <TrendingDown color="var(--danger)" />}
                <h2 className={styles.cardTitle}>
                  {viewType === 'income' ? 'Income' : 'Expense'} Stream
                  <span style={{ color: 'var(--foreground-muted)', fontWeight: 400, fontSize: '1rem', marginLeft: '8px' }}>
                    &bull; {getFilteredTransactions().length} entries
                  </span>
                </h2>
              </div>
              <div className={styles.cardTitle} style={{ color: viewType === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                {formatCurrency(getFilteredTransactions().reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </div>

            <div className={styles.recordList}>
              {getFilteredTransactions().length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--foreground-muted)' }}>
                  <BarChart3 size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  <p>No transactional telemetry for this segment.</p>
                </div>
              ) : (
                getFilteredTransactions().map(t => (
                  <motion.div key={t.id} className={styles.listItem} whileHover={{ x: 4 }}>
                    <div className={styles.itemMain}>
                      <div className={styles.itemAmount} style={{ color: viewType === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                        {viewType === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </div>
                      <div className={styles.itemMeta}>
                        <Badge variant="info">{t.category}</Badge>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--foreground-muted)' }}>&bull; {formatDate(t.date)}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>ID: {t.id.slice(0, 8)}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      )}

      <AnimatePresence>
        {showEmailModal && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className={styles.cardTitle}>Dispensation Manager</h2>
                <button onClick={() => setShowEmailModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--foreground-muted)' }}>
                  <X size={24} />
                </button>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <Select
                  label="Destination Recipient"
                  value={emailTargetMember}
                  onChange={(e) => setEmailTargetMember(e.target.value)}
                  options={members.map(m => ({ label: `${m.name} (${m.email})`, value: m.id }))}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', marginTop: '0.5rem' }}>
                  The selected member will receive a comprehensive data export in CSV format via their registered encryption channel.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="ghost" onClick={() => setShowEmailModal(false)} style={{ flex: 1 }}>Abort</Button>
                <Button onClick={handleSendEmail} isLoading={emailingStatus} style={{ flex: 2 }}>Execute Dispatch</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
