import React, { useState, useEffect, useCallback } from 'react'
import { RefreshCw, TrendingUp, Database, Layers } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import styles from './Sidebar.module.css'

function fmt(n) {
  if (n == null) return '—'
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Sidebar({ date, refreshTrigger, onCashUpdate }) {
  const { getInventory, getFinancials } = useApi()
  const [inventory, setInventory] = useState(null)
  const [financials, setFinancials] = useState(null)
  const [invLoading, setInvLoading] = useState(false)
  const [finLoading, setFinLoading] = useState(false)
  const [invError, setInvError]     = useState(null)

  const loadInventory = useCallback(async () => {
    setInvLoading(true)
    setInvError(null)
    try {
      const d = await getInventory(date)
      setInventory(d.inventory || {})
    } catch (e) {
      setInvError('Server offline')
    } finally {
      setInvLoading(false)
    }
  }, [date, getInventory])

  const loadFinancials = useCallback(async () => {
    setFinLoading(true)
    try {
      const d = await getFinancials(date)
      setFinancials(d)
      onCashUpdate?.(d.cash_balance)
    } catch {
      /* silent */
    } finally {
      setFinLoading(false)
    }
  }, [date, getFinancials, onCashUpdate])

  useEffect(() => {
    loadInventory()
    loadFinancials()
  }, [date, refreshTrigger])

  const items = inventory ? Object.entries(inventory).sort((a, b) => b[1] - a[1]) : []
  const maxStock = items[0]?.[1] || 800

  return (
    <aside className={styles.sidebar}>

      {/* ─ Financials ─ */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <TrendingUp size={13} />
          <span>FINANCIALS</span>
          <button className={styles.refreshBtn} onClick={loadFinancials} disabled={finLoading}>
            <RefreshCw size={11} className={finLoading ? styles.spin : ''} />
          </button>
        </div>
        <div className={styles.cardBody}>
          {financials ? (
            <div className={styles.metricGrid}>
              <div className={styles.metric}>
                <div className={styles.metLabel}>Cash Balance</div>
                <div className={`${styles.metValue} ${styles.amber}`}>{fmt(financials.cash_balance)}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metLabel}>Inventory Value</div>
                <div className={styles.metValue}>{fmt(financials.inventory_value)}</div>
              </div>
              <div className={`${styles.metric} ${styles.full}`}>
                <div className={styles.metLabel}>Total Assets</div>
                <div className={`${styles.metValue} ${styles.large}`}>{fmt(financials.total_assets)}</div>
              </div>
            </div>
          ) : (
            <div className={styles.loading}>Loading…</div>
          )}
        </div>
      </div>

      {/* ─ Live Inventory ─ */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Database size={13} />
          <span>LIVE INVENTORY</span>
          <span className={styles.count}>{items.length} items</span>
          <button className={styles.refreshBtn} onClick={loadInventory} disabled={invLoading}>
            <RefreshCw size={11} className={invLoading ? styles.spin : ''} />
          </button>
        </div>
        <div className={styles.cardBody}>
          {invError ? (
            <div className={styles.error}>{invError} — is server.py running?</div>
          ) : items.length === 0 && invLoading ? (
            <div className={styles.loading}>Loading…</div>
          ) : (
            <div className={styles.invList}>
              {items.map(([name, stock]) => (
                <div key={name} className={styles.invItem}>
                  <span className={styles.invName} title={name}>{name}</span>
                  <span className={styles.invStock}>{stock}</span>
                  <div className={styles.bar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${Math.min(100, (stock / maxStock) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─ Agent Architecture ─ */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Layers size={13} />
          <span>AGENT PIPELINE</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.agentList}>
            {[
              { key: 'inv',   color: 'var(--green)', bg: 'var(--green-bg)',   name: 'INVENTORY',  desc: 'Checks stock levels, estimates supplier delivery dates' },
              { key: 'quote', color: 'var(--blue)',  bg: 'var(--blue-bg)',    name: 'QUOTING',    desc: 'Calculates pricing with markup, bulk discounts, quote history' },
              { key: 'sales', color: 'var(--amber)', bg: 'rgba(232,160,32,.06)', name: 'SALES', desc: 'Finalizes transactions, updates ledger, tracks cash balance' },
            ].map(a => (
              <div key={a.key} className={styles.agentItem} style={{ background: a.bg, borderColor: a.color + '40' }}>
                <div className={styles.agentDot} style={{ background: a.color }} />
                <div>
                  <div className={styles.agentName} style={{ color: a.color }}>{a.name}</div>
                  <div className={styles.agentDesc}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </aside>
  )
}
