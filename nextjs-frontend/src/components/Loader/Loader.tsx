import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  fullPage?: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'success' | 'white';
}

export function Loader({ fullPage = false, text, size = 'medium', color = 'primary' }: LoaderProps) {
  const sizeClass = styles[size];
  const colorClass = styles[color];

  const content = (
    <div className={styles.wrapper}>
      <div className={`${styles.spinner} ${sizeClass} ${colorClass}`}></div>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        {content}
      </div>
    );
  }

  return content;
}

export function ButtonLoader({text = 'Loading...'}: {text?: string}) {
  return (
    <div className={styles.buttonLoaderWrapper}>
      <div className={`${styles.spinner} ${styles.small} ${styles.white}`}></div>
      <span>{text}</span>
    </div>
  );
}
