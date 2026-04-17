import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export const CURRENCIES = [
    { code: 'USD', name: 'US Dollar',         symbol: '$'   },
    { code: 'EUR', name: 'Euro',              symbol: '€'   },
    { code: 'CRC', name: 'Colón Costarricense', symbol: '₡' },
    { code: 'MXN', name: 'Peso Mexicano',     symbol: 'MX$' },
]

const API_URL =
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState(
    () => localStorage.getItem('orca_currency') || 'USD'
    )
    const [rates, setRates] = useState({ USD: 1, EUR: 1, CRC: 1, MXN: 1 })

    const fetchRates = useCallback(async () => {
    try {
        const res  = await fetch(API_URL)
        const data = await res.json()
        setRates({
        USD: 1,
        EUR: data.usd.eur,
        CRC: data.usd.crc,
        MXN: data.usd.mxn,
        })
    } catch (err) {
        console.error('Exchange rate fetch failed:', err)
    }
    }, [])

    useEffect(() => { fetchRates() }, [fetchRates])

    const changeCurrency = (code) => {
    setCurrency(code)
    localStorage.setItem('orca_currency', code)
    }

  /** Convierte un monto en USD a la moneda activa */
  const convert = (amountUSD) => amountUSD * (rates[currency] ?? 1)

  /** Formatea un monto USD → convertido + símbolo correcto */
    const formatAmount = (amountUSD) =>
    new Intl.NumberFormat('en-US', {
        style:                 'currency',
        currency,
        minimumFractionDigits: currency === 'CRC' ? 0 : 2,
        maximumFractionDigits: currency === 'CRC' ? 0 : 2,
    }).format(convert(amountUSD))

  /** Formatea con signo +/- para tarjetas de transacción */
    const formatDisplayAmount = (amount, type) => {
    const sign = type === 'income' ? '+' : '-'
    return `${sign}${formatAmount(Math.abs(amount))}`
    }

    return (
    <CurrencyContext.Provider
        value={{ currency, currencies: CURRENCIES, changeCurrency,
                rates, convert, formatAmount, formatDisplayAmount }}
    >
        {children}
    </CurrencyContext.Provider>
    )
}

export const useCurrency = () => useContext(CurrencyContext)