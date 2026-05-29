import React from 'react'
import { Activity } from 'lucide-react'
import styles from './Header.module.css'

export default function Header({ date, onDateChange, cashBalance }) {
  const fmt = (n) =>
    n != null
      ? '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '—'

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>MUNDER DIFFLIN</span>
          <span className={styles.logoSub}>paper co. · ai inventory system</span>
        </div>

        <div className={styles.controls}>
          <div className={styles.statusPill}>
            <Activity size={11} />
            <span>LIVE</span>
          </div>

          <label className={styles.datePicker}>
            <span className={styles.dateLabel}>DATE</span>
            <input
              type="date"
              value={date}
              onChange={e => onDateChange(e.target.value)}
              className={styles.dateInput}
            />
          </label>

          <div className={styles.cashBadge}>
            <span className={styles.cashLabel}>CASH</span>
            <span className={styles.cashValue}>{fmt(cashBalance)}</span>
          </div>
        </div>
      </div>

      {/* Amber scan line */}
      <div className={styles.scanline} />
    </header>
  )
}
