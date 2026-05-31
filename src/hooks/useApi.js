import { useState, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL

export function useApi() {
  const [loading, setLoading] = useState(false)

  const getInventory = useCallback(async (date) => {
    const r = await fetch(`${API}/api/inventory?date=${date}`)
    if (!r.ok) throw new Error('Failed to load inventory')
    return r.json()
  }, [])

  const getFinancials = useCallback(async (date) => {
    const r = await fetch(`${API}/api/financials?date=${date}`)
    if (!r.ok) throw new Error('Failed to load financials')
    return r.json()
  }, [])

  const submitRequest = useCallback(async (request, date) => {
    setLoading(true)
    try {
      const r = await fetch(`${API}/api/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request, date })
      })
      const data = await r.json()
      if (data.error) throw new Error(data.error)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, getInventory, getFinancials, submitRequest }
}
