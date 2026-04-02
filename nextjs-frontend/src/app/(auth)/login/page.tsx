"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { ButtonLoader } from '@/components/Loader/Loader';
import styles from '../auth.module.css';

export default function Login() {
  const [familyCode, setFamilyCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showForgotForm, setShowForgotForm] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyCode || !email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const response = await authApi.login(familyCode, email, password);

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        setAuth(user, accessToken, refreshToken);
        setSuccessMsg('Login successful!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotFamilyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMsg('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const response = await authApi.forgotFamilyCode(forgotEmail);

      if (response.data.success) {
        setSuccessMsg('Family code sent to your email!');
        setShowForgotForm(false);
        setForgotEmail('');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to send family code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Family Expense Tracker</h1>
        <p className={styles.subtitle}>
          {showForgotForm ? 'Forgot Family Code' : 'Login to your family account'}
        </p>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}
        {successMsg && <div className={styles.success}>{successMsg}</div>}

        {!showForgotForm ? (
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
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
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? <ButtonLoader text="Logging in..." /> : 'Login'}
            </button>

            <button
              type="button"
              className={styles.buttonClear}
              onClick={() => {
                setShowForgotForm(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              Forgot Family Code?
            </button>

            <p className={styles.footerText}>
              Don't have an account?{' '}
              <span className={styles.link} onClick={() => router.push('/register')}>
                Register
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgotFamilyCode}>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '1rem', color: '#64748b' }}>
              Enter your email address and we'll send your family code to your inbox.
            </p>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? <ButtonLoader text="Sending..." /> : 'Send Family Code'}
            </button>

            <button
              type="button"
              className={styles.buttonClear}
              onClick={() => {
                setShowForgotForm(false);
                setErrorMsg('');
              }}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
