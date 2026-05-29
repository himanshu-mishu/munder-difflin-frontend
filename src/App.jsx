import React, { useState, useRef, useEffect, useCallback } from 'react'
import Header from './components/Header'
import RequestInput from './components/RequestInput'
import AgentPipeline from './components/AgentPipeline'
import ResponseCard from './components/ResponseCard'
import Sidebar from './components/Sidebar'
import { useApi } from './hooks/useApi'
import styles from './App.module.css'

const today = new Date().toISOString().split('T')[0]

export default function App() {
  const [date, setDate]             = useState(today)
  const [messages, setMessages]     = useState([])
  const [cashBalance, setCashBalance] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const feedEnd = useRef(null)
  const { submitRequest } = useApi()

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, processing])

  const handleSubmit = useCallback(async (text) => {
    setProcessing(true)
    try {
      const data = await submitRequest(text, date)
      setMessages(prev => [...prev, {
        id: Date.now(),
        request: text,
        response: data.response,
        date,
        error: null,
      }])
      if (data.cash_balance != null) setCashBalance(data.cash_balance)
      setRefreshKey(k => k + 1)
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        request: text,
        error: e.message || 'Unknown error',
        date,
      }])
    } finally {
      setProcessing(false)
    }
  }, [date, submitRequest])

  return (
    <div className={styles.app}>
      <Header date={date} onDateChange={setDate} cashBalance={cashBalance} />

      <div className={styles.layout}>
        {/* ── Main column ── */}
        <main className={styles.main}>
          <RequestInput onSubmit={handleSubmit} loading={processing} />

          <div className={styles.feed}>
            {messages.length === 0 && !processing ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                    <rect x="8" y="12" width="44" height="36" rx="3" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <path d="M18 22h24M18 30h16M18 38h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="46" cy="42" r="8" fill="var(--amber)" opacity="0.15"/>
                    <path d="M43 42l2 2 4-4" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>Agents Standing By</h3>
                <p className={styles.emptyText}>
                  Submit a request to trigger the multi-agent pipeline.<br/>
                  Inventory → Quoting → Sales, fully automated.
                </p>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <ResponseCard key={msg.id} message={msg} />
                ))}
                {processing && <AgentPipeline active />}
              </>
            )}
            <div ref={feedEnd} />
          </div>
        </main>

        {/* ── Sidebar ── */}
        <Sidebar
          date={date}
          refreshTrigger={refreshKey}
          onCashUpdate={setCashBalance}
        />
      </div>
    </div>
  )
}
