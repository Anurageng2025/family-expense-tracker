"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import styles from '../auth.module.css';

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
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
    if (!otp) {
      setErrorMsg('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const response = await authApi.verifyOtp(email, otp);

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
          setSuccessMsg(`Registration successful! Your family code is: ${newFamilyCode}`);
        } else {
          setSuccessMsg('Registration successful!');
        }

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>
        <p className={styles.subtitle}>Step {step} of 3</p>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}
        {successMsg && <div className={styles.success}>{successMsg}</div>}

        {step === 1 && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.formGroup}>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: '#64748b' }}>
              We sent a 6-digit OTP to {email}
            </p>
            <label className={styles.label}>OTP</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              className={styles.buttonClear}
              onClick={handleSendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <label className={styles.label} style={{ marginTop: '1rem' }}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className={styles.radioGroup} style={{ marginTop: '1.25rem' }}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  target="familyType"
                  value="new"
                  checked={familyType === 'new'}
                  onChange={() => setFamilyType('new')}
                />
                Create New Family
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  target="familyType"
                  value="existing"
                  checked={familyType === 'existing'}
                  onChange={() => setFamilyType('existing')}
                />
                Join Existing Family
              </label>
            </div>

            {familyType === 'new' ? (
              <div style={{ marginTop: '1rem' }}>
                <label className={styles.label}>Family Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Enter family name"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div style={{ marginTop: '1rem' }}>
                <label className={styles.label}>Family Code</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Enter family code"
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="button"
              className={styles.button}
              style={{ marginTop: '1.5rem' }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Completing...' : 'Complete Registration'}
            </button>
          </div>
        )}

        <p className={styles.footerText}>
          Already have an account?{' '}
          <span className={styles.link} onClick={() => router.push('/login')}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
