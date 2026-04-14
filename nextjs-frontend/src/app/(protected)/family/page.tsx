"use client";

import React, { useEffect, useState } from 'react';
import { familyApi, reminderApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import styles from './family.module.css';
import { Card, Badge, Button, Input } from '@/components/UI';
import { 
  Users, Key, Copy, Bell, Trash2, 
  CheckCircle, Circle, X, Info,
  Mail, Calendar, Shield, Share2, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationStatus } from '@/components/LocationStatus';

export default function Family() {
  const [family, setFamily] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { user } = useAuthStore();

  const fetchFamily = async () => {
    try {
      setLoading(true);
      const response = await familyApi.getFamily();
      if (response.data.success) setFamily(response.data.data);
    } catch {
      console.error('Failed to load family data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Remove this member from the family workspace?')) return;
    try {
      setLoading(true);
      await familyApi.removeMember(memberId);
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
      alert('Reminder dispatched!');
    } catch {
      alert('Network error while sending reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToAll = async () => {
    try {
      setLoading(true);
      await reminderApi.sendToAll();
      alert('Global reminders dispatched!');
    } catch {
      alert('Failed to reach all members');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulk = async () => {
    if (selectedMembers.length === 0) return;
    try {
      setLoading(true);
      await reminderApi.sendBulk(selectedMembers);
      setShowReminderModal(false);
      setSelectedMembers([]);
      alert('Batch reminders dispatched!');
    } catch {
      alert('Batch operation failed');
    } finally {
      setLoading(false);
    }
  };
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleRequestLocationReport = async () => {
    try {
      setLoading(true);
      const response = await familyApi.requestLocationReport();
      if (response.data.success) {
        alert('📦 Location report has been dispatched to your email!');
      }
    } catch {
      alert('Failed to request location report');
    } finally {
      setLoading(false);
    }
  };

  const formatLastSeen = (dateString: string) => {
    if (!dateString) return 'Location not sharing';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return 'Active now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.round(diffMins / 60)}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const copyCode = () => {
    if (family?.familyCode) {
      navigator.clipboard.writeText(family.familyCode);
      alert('Invitation code copied to clipboard!');
    }
  };

  if (!family) {
    return (
      <div className={styles.container} style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Users size={48} color="var(--border)" />
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
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
      <header>
        <h1 className={styles.title}>{family.familyName}</h1>
        <p style={{ color: 'var(--foreground-muted)' }}>Manage collaborative financial access and synchronization.</p>
      </header>

      <motion.div variants={itemVariants}>
        <LocationStatus />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className={styles.codeCard}>
          <div className={styles.codeArea}>
            <div className={styles.label}>Family Workspace Code</div>
            <div className={styles.codeValue}>{family.familyCode}</div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--foreground-muted)' }}>
              Provide this code to new members to grant them access to family books.
            </p>
          </div>
          <Button variant="ghost" onClick={copyCode}>
            <Copy size={18} style={{ marginRight: '8px' }} />
            Copy
          </Button>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="var(--primary)" />
              <h2 className={styles.cardTitle}>Collective Members ({family.users.length})</h2>
            </div>
          </div>
          
          <div className={styles.memberList}>
            {family.users.map((member: any) => (
              <motion.div key={member.id} className={styles.memberItem} whileHover={{ x: 4 }}>
                <div className={styles.memberInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <div className={styles.memberName}>{member.name}</div>
                    <Badge variant={member.role === 'ADMIN' ? 'success' : 'info'}>
                      {member.role}
                    </Badge>
                  </div>
                  <div className={styles.memberMeta}>
                    <Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {member.email} &bull; <Calendar size={12} style={{ display: 'inline', margin: '0 4px' }} /> {formatDate(member.createdAt)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={10} />
                    <span>{formatLastSeen(member.lastLocationAt)}</span>
                    {member.lastLocationAt && member.locationType && (
                      <span style={{ 
                        fontSize: '9px', 
                        padding: '1px 4px', 
                        background: member.locationType === 'IP' ? 'rgba(254, 235, 200, 0.5)' : 'rgba(198, 246, 213, 0.5)', 
                        color: member.locationType === 'IP' ? '#7b341e' : '#22543d',
                        borderRadius: '3px',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        {member.locationType === 'IP' ? 'Estimate' : 'GPS'}
                      </span>
                    )}
                  </div>
                </div>
                
                {user?.role === 'ADMIN' && (
                  <div className={styles.actions}>
                    <motion.button 
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      className={styles.actionBtn}
                      onClick={() => handleSendReminder(member.id)}
                      title="Direct Reminder"
                      style={{ color: 'var(--primary)', background: 'rgba(79, 70, 229, 0.05)' }}
                    >
                      <Bell size={16} />
                    </motion.button>

                    {member.id !== user?.id && (
                      <motion.button 
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        className={styles.actionBtn}
                        onClick={() => handleDeleteMember(member.id)}
                        style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.1)' }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {user?.role === 'ADMIN' && (
        <motion.div variants={itemVariants}>
          <Card className={styles.reminderCard}>
            <div className={styles.cardHeader} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Bell size={20} color="var(--primary)" />
              <h2 className={styles.cardTitle}>Operations Control</h2>
            </div>
            <p style={{ marginBottom: '2rem', color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>
              Broadcast synchronization requests or target specific members to ensure financial accurate reporting.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button onClick={handleSendToAll} isLoading={loading} style={{ flex: 1 }}>
                Broadcast to All
              </Button>
              <Button variant="ghost" onClick={() => setShowReminderModal(true)} disabled={loading} style={{ flex: 1 }}>
                Targeted Dispatch
              </Button>
              <Button 
                onClick={handleRequestLocationReport} 
                isLoading={loading} 
                className={styles.locationBtn}
                style={{ flex: 1, minWidth: '200px', background: 'var(--success)', borderColor: 'var(--success)' }}
              >
                <MapPin size={18} style={{ marginRight: '8px' }} />
                Email Current Locations
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <AnimatePresence>
        {showReminderModal && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className={styles.cardTitle}>Selection Manager</h2>
                <button onClick={() => setShowReminderModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--foreground-muted)' }}>
                  <X size={24} />
                </button>
              </div>
              
              <div className={styles.memberSelectionList}>
                {family.users.map((member: any) => (
                  <label key={member.id} className={styles.selectionLabel}>
                    <div onClick={() => toggleMemberSelection(member.id)} style={{ cursor: 'pointer' }}>
                      {selectedMembers.includes(member.id) ? (
                        <CheckCircle size={22} color="var(--primary)" />
                      ) : (
                        <Circle size={22} color="var(--border)" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{member.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{member.email}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    if (selectedMembers.length === family.users.length) setSelectedMembers([]);
                    else setSelectedMembers(family.users.map((u: any) => u.id));
                  }}
                  style={{ flex: 1 }}
                >
                  {selectedMembers.length === family.users.length ? 'Deselect' : 'Select All'}
                </Button>
                <Button 
                  onClick={handleSendBulk} 
                  disabled={selectedMembers.length === 0}
                  isLoading={loading}
                  style={{ flex: 2 }}
                >
                  Dispatch Requests ({selectedMembers.length})
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
