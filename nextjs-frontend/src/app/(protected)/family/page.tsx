"use client";

import React, { useEffect, useState } from 'react';
import { familyApi, reminderApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import styles from './family.module.css';

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  createdAt: string;
}

interface FamilyData {
  id: string;
  familyName: string;
  familyCode: string;
  users: FamilyMember[];
}

export default function Family() {
  const [family, setFamily] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { user } = useAuthStore();

  const fetchFamily = async () => {
    try {
      setLoading(true);
      const response = await familyApi.getFamily();
      if (response.data.success) {
        setFamily(response.data.data);
      }
    } catch {
      alert('Failed to load family data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      setLoading(true);
      await familyApi.removeMember(memberId);
      alert('Member removed successfully');
      fetchFamily();
    } catch {
      alert('Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (memberId: string) => {
    try {
      setLoading(true);
      await reminderApi.sendToMember(memberId);
      alert('Reminder sent!');
    } catch {
      alert('Failed to send reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToAll = async () => {
    try {
      setLoading(true);
      const response = await reminderApi.sendToAll();
      alert(response.data.data?.message || 'Reminders sent to all members!');
    } catch {
      alert('Failed to send reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulk = async () => {
    if (selectedMembers.length === 0) return alert('Select members first');
    try {
      setLoading(true);
      await reminderApi.sendBulk(selectedMembers);
      alert('Reminders sent successfully!');
      setShowReminderModal(false);
      setSelectedMembers([]);
    } catch {
      alert('Failed to send reminders');
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (!family) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{family.familyName}</h1>

      <div className={styles.card}>
        <div className={styles.cardHeader}>Family Details</div>
        <div className={styles.cardContent}>
          <p style={{ margin: 0, fontWeight: 500, color: '#1e293b' }}>
            Family Code: <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{family.familyCode}</span>
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
            Share this code with family members so they can join.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>Family Members ({family.users.length})</div>
        <div className={styles.cardContent}>
          <div className={styles.memberList}>
            {family.users.map((member) => (
              <div key={member.id} className={styles.memberItem}>
                <div className={styles.memberInfo}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={styles.memberName}>{member.name}</div>
                    <span className={`${styles.badge} ${member.role === 'ADMIN' ? styles.badgeAdmin : ''}`}>
                      {member.role}
                    </span>
                  </div>
                  <div className={styles.memberMeta}>
                    {member.email} &bull; Joined: {formatDate(member.createdAt)}
                  </div>
                </div>
                
                {user?.role === 'ADMIN' && (
                  <div className={styles.actions}>
                    <button 
                      className={`${styles.btn} ${styles.btnOutline}`}
                      onClick={() => handleSendReminder(member.id)}
                      title="Send Reminder"
                    >
                      Remind
                    </button>

                    {member.id !== user?.id && (
                      <button 
                        className={`${styles.btn} ${styles.btnDangerOutline}`}
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {user?.role === 'ADMIN' && (
        <div className={styles.card} style={{ borderTop: '4px solid #3b82f6' }}>
          <div className={styles.cardHeader}>⏰ Send Expense Reminders</div>
          <div className={styles.cardContent}>
            <p style={{ marginBottom: '1.5rem', color: '#475569', fontSize: '0.875rem' }}>
              Remind family members to log their daily expenses.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleSendToAll}
                disabled={loading}
              >
                Send to All Members
              </button>
              <button 
                className={`${styles.btn} ${styles.btnOutline}`}
                onClick={() => setShowReminderModal(true)}
                disabled={loading}
              >
                Select & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {showReminderModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Select Members to Remind</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {family.users.map(member => (
                <label key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleMemberSelection(member.id)}
                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>{member.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{member.email}</div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyItems: 'space-between' }}>
              <button 
                className={`${styles.btn} ${styles.btnOutline}`} 
                onClick={() => {
                  if (selectedMembers.length === family.users.length) setSelectedMembers([]);
                  else setSelectedMembers(family.users.map(u => u.id));
                }}
              >
                {selectedMembers.length === family.users.length ? 'Deselect All' : 'Select All'}
              </button>
              
              <div style={{ flex: 1 }}></div>

              <button 
                className={`${styles.btn} ${styles.btnOutline}`} 
                onClick={() => setShowReminderModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`} 
                onClick={handleSendBulk}
                disabled={selectedMembers.length === 0}
              >
                Send Reminders ({selectedMembers.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
