"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Card, Input, Button } from '@/components/UI';
import { UserPlus, Wallet, Mail, ShieldCheck, User as UserIcon, Lock, Users, Building, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../auth.module.css';

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(data)) return;
    const newOtp = [...otp];
    for (let i = 0; i < data.length; i++) newOtp[i] = data[i];
    setOtp(newOtp);
    otpRefs.current[data.length < 6 ? data.length : 5]?.focus();
  };

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [familyType, setFamilyType] = useState<'new' | 'existing'>('new');
  const [familyName, setFamilyName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMsg('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const response = await authApi.sendOtp(email);

      if (response.data.success) {
        setSuccessMsg('OTP sent to your email!');
        setStep(2);
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const response = await authApi.verifyOtp(email, fullOtp);

      if (response.data.success) {
        setSuccessMsg('OTP verified successfully!');
        setStep(3);
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (familyType === 'new' && !familyName) {
      setErrorMsg('Please enter family name');
      return;
    }

    if (familyType === 'existing' && !familyCode) {
      setErrorMsg('Please enter family code');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const response = await authApi.register({
        email,
        password,
        name,
        ...(familyType === 'new' ? { familyName } : { familyCode }),
      });

      if (response.data.success) {
        const { user, accessToken, refreshToken, familyCode: newFamilyCode } = response.data.data;
        setAuth(user, accessToken, refreshToken);

        if (newFamilyCode) {
          setSuccessMsg(`Account created! Your Family Code is ${newFamilyCode}`);
        } else {
          setSuccessMsg('Registration successful!');
        }

        setTimeout(() => router.push('/'), 2000);
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFamilyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 6) setFamilyCode(val);
  };

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.wrapper}
      >
        <div className={styles.logoSection}>
          <div className={styles.iconCircle}>
            <Wallet size={32} />
          </div>
          <h1 className={styles.brandTitle}>Expansis</h1>
        </div>

        <Card className={styles.authCard}>
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.cardTitle}>Join Expansis</h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--ring)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                STEP {step}/3
              </span>
            </div>
            <p className={styles.cardSubtitle}>Start managing family finances today</p>
          </div>

          {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}
          {successMsg && <div className={styles.alertSuccess}>{successMsg}</div>}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={styles.form}
              >
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@family.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  onClick={handleSendOtp} 
                  isLoading={loading}
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  {!loading && <Mail size={18} />}
                  Send Verification OTP
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={styles.form}
              >
                <p style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
                  A verification code was sent to <br/><strong>{email}</strong>
                </p>
                <div className={styles.otpContainer}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      className={styles.otpInput}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                    />
                  ))}
                </div>
                <Button 
                  onClick={handleVerifyOtp} 
                  isLoading={loading}
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  Verify Code
                </Button>
                <button
                  type="button"
                  className={styles.ghostLink}
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Resend OTP Code
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.form}
              >
                <Input
                  label="Your Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Secure Password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="familyType"
                      value="new"
                      checked={familyType === 'new'}
                      onChange={() => setFamilyType('new')}
                    />
                    <Building size={18} />
                    Create New Family
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="familyType"
                      value="existing"
                      checked={familyType === 'existing'}
                      onChange={() => setFamilyType('existing')}
                    />
                    <Users size={18} />
                    Join Existing Family
                  </label>
                </div>

                {familyType === 'new' ? (
                  <Input
                    label="Family Group Name"
                    placeholder="e.g. Smith Family"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    required
                  />
                ) : (
                  <Input
                    label="Enter Family Code"
                    placeholder="6-digit family code"
                    value={familyCode}
                    onChange={handleFamilyCodeChange}
                    required
                  />
                )}

                <Button
                  onClick={handleRegister}
                  className={styles.submitBtn}
                  isLoading={loading}
                  disabled={loading}
                  variant="primary"
                >
                  {!loading && <CheckCircle2 size={18} />}
                  Complete Set Up
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <p className={styles.footerText}>
            Already on Expansis?{' '}
            <span className={styles.textLink} onClick={() => router.push('/login')}>
              Login
            </span>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
