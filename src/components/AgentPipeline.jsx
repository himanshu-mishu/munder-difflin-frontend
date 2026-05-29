import React, { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import styles from './AgentPipeline.module.css'

const STEPS = [
  { id: 'parse',     label: 'Parsing order details',          agent: null,        delay: 0 },
  { id: 'inventory', label: 'Inventory agent · checking stock', agent: 'INVENTORY', delay: 2000 },
  { id: 'quote',     label: 'Quoting agent · calculating price', agent: 'QUOTING',  delay: 6000 },
  { id: 'sales',     label: 'Sales agent · finalizing order',  agent: 'SALES',     delay: 11000 },
]

export default function AgentPipeline({ active }) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!active) { setCurrentStep(0); return }
    const timers = STEPS.map((step, i) =>
      setTimeout(() => setCurrentStep(i), step.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [active])

  if (!active) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Loader2 size={13} className={styles.spin} />
        <span>AGENTS PROCESSING</span>
      </div>
      <div className={styles.steps}>
        {STEPS.map((step, i) => {
          const done    = i < currentStep
          const running = i === currentStep
          return (
            <div
              key={step.id}
              className={`${styles.step} ${done ? styles.done : ''} ${running ? styles.running : ''}`}
            >
              <div className={styles.icon}>
                {done    ? <CheckCircle2 size={14} /> :
                 running ? <Loader2 size={14} className={styles.spin} /> :
                           <Circle size={14} />}
              </div>
              <div className={styles.info}>
                {step.agent && (
                  <span className={`${styles.agentTag} ${styles[step.id]}`}>{step.agent}</span>
                )}
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
              {running && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
