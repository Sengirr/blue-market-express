import React, { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, PieChart, TrendingDown, Tag } from 'lucide-react'

export function TransactionsView({ transactions, onAddTransaction, onEditTransaction, onDeleteTransaction }) {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)

    // Prepare filter options
    const years = Array.from(new Set([currentYear, ...(transactions || []).map(t => new Date(t.date).getFullYear())])).sort((a, b) => b - a)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    // Filter transactions for the selected period
    const filteredTransactions = useMemo(() => {
        if (!transactions) return []
        return transactions.filter(t => {
            const d = new Date(t.date)
            const matchYear = d.getFullYear() === Number(selectedYear)
            const matchMonth = selectedMonth === 'all' ? true : d.getMonth() === Number(selectedMonth)
            return matchYear && matchMonth
        })
    }, [transactions, selectedYear, selectedMonth])

    // Calculate stats
    const totalExpenses = filteredTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0)
    
    const fixedExpenses = filteredTransactions.filter(t => t.expense_type === 'fixed').reduce((sum, t) => sum + Number(t.amount || 0), 0)
    const variableExpenses = filteredTransactions.filter(t => t.expense_type !== 'fixed').reduce((sum, t) => sum + Number(t.amount || 0), 0)
    
    const fixedPercentage = totalExpenses > 0 ? Math.round((fixedExpenses / totalExpenses) * 100) : 0
    const variablePercentage = totalExpenses > 0 ? Math.round((variableExpenses / totalExpenses) * 100) : 0

    // Top Category
    const categoryTotals = useMemo(() => {
        const sums = {}
        filteredTransactions.forEach(t => {
            const catName = t.categories?.name || 'Varios'
            sums[catName] = (sums[catName] || 0) + Number(t.amount || 0)
        })
        return sums
    }, [filteredTransactions])

    const topCategory = useMemo(() => {
        let max = 0
        let topCat = 'Ninguna'
        Object.entries(categoryTotals).forEach(([cat, sum]) => {
            if (sum > max) {
                max = sum
                topCat = cat
            }
        })
        return { name: topCat, amount: max }
    }, [categoryTotals])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header and Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Gestión de Gastos</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Análisis y registro de salidas de dinero</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                        >
                            <option value="all">Todo el año</option>
                            {months.map((m, i) => (
                                <option key={m} value={i}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={onAddTransaction} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} />
                        Nuevo Gasto
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--danger)', color: 'white' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingDown size={32} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Gastos Totales (Periodo)</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{totalExpenses.toLocaleString()}€</h2>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PieChart size={32} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Distribución del Gasto</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
                            <span style={{ color: '#3b82f6' }}>Fijo ({fixedPercentage}%)</span>
                            <span style={{ color: 'var(--text-muted)' }}>Variable ({variablePercentage}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                            <div style={{ width: `${fixedPercentage}%`, background: '#3b82f6', height: '100%' }}></div>
                            <div style={{ width: `${variablePercentage}%`, background: 'var(--text-muted)', height: '100%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tag size={32} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Categoría de Mayor Gasto</p>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                            {topCategory.name}
                        </h2>
                        {topCategory.amount > 0 && (
                            <p style={{ fontSize: '0.875rem', color: '#eab308', fontWeight: 600 }}>{topCategory.amount.toLocaleString()}€ gastados</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fecha</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Descripción</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Categoría</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Tipo</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Proveedor</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cantidad</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No hay gastos registrados en este periodo.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{t.description || '-'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '0.3rem 0.6rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {t.categories?.name || 'Varios'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', textTransform: 'capitalize', color: 'var(--text-muted)' }}>
                                        {t.expense_type === 'fixed' ? 'Fijo' : 'Variable'}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {t.super_suppliers?.name || '-'}
                                    </td>
                                    <td style={{
                                        padding: '1rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: 'var(--danger)'
                                    }}>
                                        -{Number(t.amount).toLocaleString()}€
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => onEditTransaction(t)}
                                                style={{ padding: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDeleteTransaction(t.id)}
                                                style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
