'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from './UI';
import { Shield, ShieldAlert, Zap, ZapOff, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LocationStatus: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    setWakeLockSupported('wakeLock' in navigator);
  }, []);

  const toggleProtection = async () => {
    if (isActive) {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      setIsActive(false);
    } else {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          
          // Re-request if visibility changes
          const handleVisibilityChange = async () => {
            if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
              wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
            }
          };
          document.addEventListener('visibilitychange', handleVisibilityChange);
          
          wakeLockRef.current.addEventListener('release', () => {
            console.log('🔒 Wake Lock was released');
          });
        }
        setIsActive(true);
      } catch (err: any) {
        console.error(`❌ Wake Lock failed: ${err.message}`);
        alert('Could not activate Active Protection. Please check browser permissions.');
      }
    }
  };

  return (
    <Card style={{ marginBottom: '1.5rem', overflow: 'hidden', border: isActive ? '1px solid var(--success)' : '1px solid var(--border)' }}>
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              padding: '10px', 
              borderRadius: '12px', 
              background: isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isActive ? 'var(--success)' : 'var(--danger)'
            }}>
              {isActive ? <Shield size={24} /> : <ShieldAlert size={24} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Active Safety Support</h3>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--foreground-muted)' }}>
                {isActive 
                  ? 'App is currently locked in "Alive" mode for family tracking.' 
                  : 'Background tracking might be restricted by your phone.'}
              </p>
            </div>
          </div>
          <Button 
            variant={isActive ? 'success' : 'ghost'} 
            onClick={toggleProtection}
            style={{ minWidth: '120px' }}
          >
            {isActive ? <Zap size={16} /> : <ZapOff size={16} />}
            <span style={{ marginLeft: '8px' }}>{isActive ? 'Active' : 'Enable'}</span>
          </Button>
        </div>

        <AnimatePresence>
          {!isActive && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ 
                marginTop: '1rem', 
                padding: '12px', 
                background: 'var(--background-alt)', 
                borderRadius: '8px',
                fontSize: '0.75rem',
                display: 'flex',
                gap: '8px',
                color: 'var(--foreground-muted)'
              }}>
                <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  Enable <strong>Active Support</strong> to prevent your phone from putting the Expansis PWA to sleep. This ensures your family can always see your location on demand.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {isActive && (
        <div style={{ 
          background: 'var(--success)', 
          height: '3px', 
          width: '100%' 
        }}>
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{ background: 'white', height: '100%', width: '30%', opacity: 0.5 }}
          />
        </div>
      )}
    </Card>
  );
};
