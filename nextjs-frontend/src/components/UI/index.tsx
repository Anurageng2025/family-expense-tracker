export { default as Button } from './Button';
import React from 'react';
import styles from './UI.module.css';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, onClick, style }) => {
  return (
    <div 
      className={clsx(styles.card, hoverable && styles.cardHover, className)}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

import { AlertCircle } from 'lucide-react';

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <input 
        className={clsx(
          styles.input,
          error && styles.inputError,
          className
        )} 
        {...props} 
      />
      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => {
  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <select 
        className={clsx(
          styles.input,
          styles.select,
          error && styles.selectError,
          className
        )} 
        {...props} 
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
};
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'primary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className }) => {
  const variantStyles = {
    success: { background: 'var(--success)', color: 'white' },
    danger: { background: 'var(--danger)', color: 'white' },
    warning: { background: 'var(--warning)', color: 'white' },
    info: { background: 'var(--info)', color: 'white' },
    primary: { background: 'var(--primary)', color: 'white' },
  };

  return (
    <span 
      className={clsx(styles.badge, className)}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
};
