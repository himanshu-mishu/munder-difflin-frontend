import React, { useState, useRef } from 'react'
import { Send, ChevronRight } from 'lucide-react'
import styles from './RequestInput.module.css'

const SUGGESTIONS = [
  'Quote for 200 units of Glossy paper',
  'Check availability of Cardstock',
  'I need 500 A4 paper for an office order',
  '100 Notepads + 50 Presentation folders',
  'Order 300 units of Matte paper',
]

export default function RequestInput({ onSubmit, loading }) {
  const [value, setValue] = useState('')
  const ref = useRef()

  const handleSubmit = () => {
    if (!value.trim() || loading) return
    onSubmit(value.trim())
    setValue('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>
        <ChevronRight size={12} />
        <span>SUBMIT REQUEST</span>
        <span className={styles.hint}>⌘↵ to send</span>
      </div>

      <div className={styles.inputWrap} data-focused={undefined}>
        <textarea
          ref={ref}
          className={styles.textarea}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. I need a quote for 300 units of Glossy paper and 100 Cardstock…"
          rows={3}
          disabled={loading}
        />
        <div className={styles.bar}>
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className={styles.chip}
                onClick={() => { setValue(s); ref.current?.focus() }}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            className={styles.sendBtn}
            onClick={handleSubmit}
            disabled={!value.trim() || loading}
          >
            {loading ? (
              <span className={styles.loadingDots}>
                <span /><span /><span />
              </span>
            ) : (
              <>
                <Send size={13} />
                <span>SEND</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
