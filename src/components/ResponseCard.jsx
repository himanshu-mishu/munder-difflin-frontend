import React, { useState } from 'react'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Package, Tag, ShoppingCart } from 'lucide-react'
import styles from './ResponseCard.module.css'

function parseResponse(raw) {
  const invMatch  = raw.match(/INVENTORY STATUS[-\s]*([\s\S]*?)(?=QUOTE DETAILS|$)/i)
  const quoteMatch = raw.match(/QUOTE DETAILS[-\s]*([\s\S]*?)(?=ORDER STATUS|$)/i)
  const orderMatch = raw.match(/ORDER STATUS[-\s]*([\s\S]*?)(?=INVENTORY STATUS|Thank you|$)/i)

  return {
    inventory: invMatch?.[1]?.trim()  || '',
    quote:     quoteMatch?.[1]?.trim() || '',
    order:     orderMatch?.[1]?.trim() || '',
    raw,
  }
}

function Section({ icon: Icon, label, agentClass, content, contentClass }) {
  const [open, setOpen] = useState(true)
  if (!content) return null
  return (
    <div className={`${styles.section} ${styles[agentClass]}`}>
      <button className={styles.sectionHeader} onClick={() => setOpen(o => !o)}>
        <Icon size={13} />
        <span className={`${styles.agentBadge} ${styles[agentClass + 'Badge']}`}>{label}</span>
        {open ? <ChevronUp size={13} className={styles.chevron} /> : <ChevronDown size={13} className={styles.chevron} />}
      </button>
      {open && (
        <pre className={`${styles.sectionContent} ${contentClass ? styles[contentClass] : ''}`}>
          {content}
        </pre>
      )}
    </div>
  )
}

export default function ResponseCard({ message }) {
  const { request, response, date, error } = message

  if (error) {
    return (
      <div className={styles.errorCard}>
        <XCircle size={15} />
        <div>
          <div className={styles.errorTitle}>Request failed</div>
          <div className={styles.errorMsg}>{error}</div>
        </div>
      </div>
    )
  }

  const s = parseResponse(response || '')
  const isSuccess  = response?.toLowerCase().includes('order successfully completed')
  const isRejected = response?.toLowerCase().includes('unable to fulfill')

  return (
    <div className={`${styles.card} ${isSuccess ? styles.success : ''} ${isRejected ? styles.rejected : ''}`}>
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.pipeline}>
            <span className={`${styles.pTag} ${styles.pInv}`}>INVENTORY</span>
            <span className={styles.arrow}>→</span>
            <span className={`${styles.pTag} ${styles.pQuote}`}>QUOTING</span>
            <span className={styles.arrow}>→</span>
            <span className={`${styles.pTag} ${styles.pSales}`}>SALES</span>
          </div>
          <span className={styles.dateTag}>{date}</span>
        </div>
        {isSuccess  && <span className={styles.statusBadge}><CheckCircle2 size={12}/> COMPLETED</span>}
        {isRejected && <span className={styles.statusBadgeRed}><XCircle size={12}/> REJECTED</span>}
      </div>

      {/* Request echo */}
      <div className={styles.requestEcho}>
        <span className={styles.reqLabel}>REQUEST</span>
        <span className={styles.reqText}>{request}</span>
      </div>

      {/* Agent sections */}
      <div className={styles.sections}>
        <Section icon={Package}     label="INVENTORY AGENT" agentClass="inv"   content={s.inventory} />
        <Section icon={Tag}         label="QUOTING AGENT"   agentClass="quote" content={s.quote} />
        <Section icon={ShoppingCart} label="SALES AGENT"    agentClass="sales" content={s.order}
          contentClass={isSuccess ? 'successContent' : isRejected ? 'rejectedContent' : ''} />
        {!s.inventory && !s.quote && !s.order && (
          <pre className={styles.rawContent}>{response}</pre>
        )}
      </div>
    </div>
  )
}
