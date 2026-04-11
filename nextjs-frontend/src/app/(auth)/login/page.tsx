"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Card, Input, Button } from '@/components/UI';
import { LogIn, Key, Mail, Wallet, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  const handleFamilyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 6) {
      setFamilyCode(val);
    }
  };

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
        // Small delay for the success message to be seen
        setTimeout(() => router.push('/'), 1000); 
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
          <AnimatePresence mode="wait">
            {!showForgotForm ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Welcome Back</h2>
                  <p className={styles.cardSubtitle}>Login to your family dashboard</p>
                </div>

                {errorMsg && (
                  <div className={styles.alertError}>
                    <AlertCircle size={18} />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && <div className={styles.alertSuccess}>{successMsg}</div>}

                <form onSubmit={handleLogin} className={styles.form}>
                  <Input
                    label="Family Code"
                    placeholder="6-digit code"
                    value={familyCode}
                    onChange={handleFamilyCodeChange}
                    maxLength={6}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@family.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <Button 
                    type="submit" 
                    className={styles.submitBtn} 
                    isLoading={loading}
                    disabled={loading}
                  >
                    {!loading && <LogIn size={18} />}
                    Login to Portal
                  </Button>

                  <button
                    type="button"
                    className={styles.ghostLink}
                    onClick={() => {
                      setShowForgotForm(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                  >
                    <Key size={14} />
                    Forgot Family Code?
                  </button>

                  <div className={styles.divider}>
                    <span>OR</span>
                  </div>

                  <p className={styles.footerText}>
                    New family?{' '}
                    <span className={styles.textLink} onClick={() => router.push('/register')}>
                      Create Account
                    </span>
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Recover Code</h2>
                  <p className={styles.cardSubtitle}>We'll send your family code via email</p>
                </div>

                {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}

                <form onSubmit={handleForgotFamilyCode} className={styles.form}>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Your registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />

                  <Button 
                    type="submit" 
                    variant="primary"
                    className={styles.submitBtn} 
                    isLoading={loading}
                    disabled={loading}
                  >
                    {!loading && <Send size={18} />}
                    Send Code
                  </Button>

                  <button
                    type="button"
                    className={styles.ghostLink}
                    onClick={() => {
                      setShowForgotForm(false);
                      setErrorMsg('');
                    }}
                  >
                    <ArrowLeft size={14} />
                    Back to Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
