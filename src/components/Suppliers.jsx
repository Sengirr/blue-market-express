import React, { useState, useMemo } from 'react'
import { Users, Phone, Mail, MapPin, Plus, Edit2, Trash2, Calendar, CreditCard, Banknote, Landmark, TrendingUp, Search } from 'lucide-react'

export function SuppliersView({ suppliers, transactions, onAddSupplier, onEditSupplier, onDeleteSupplier }) {
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [searchTerm, setSearchTerm] = useState('')

    // Prepare filter options
    const years = Array.from(new Set([currentYear, ...(transactions || []).map(t => new Date(t.date).getFullYear())])).sort((a, b) => b - a)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    // Filter transactions to get only expenses for the selected period
    const filteredExpenses = useMemo(() => {
        if (!transactions) return []
        return transactions.filter(t => {
            if (t.type !== 'expense') return false
            const d = new Date(t.date)
            const matchYear = d.getFullYear() === Number(selectedYear)
            const matchMonth = selectedMonth === 'all' ? true : d.getMonth() === Number(selectedMonth)
            return matchYear && matchMonth
        })
    }, [transactions, selectedYear, selectedMonth])

    // Calculate total purchases
    const totalPurchases = filteredExpenses.reduce((sum, t) => sum + Number(t.amount || 0), 0)

    // Calculate expenses per supplier
    const expensesBySupplier = useMemo(() => {
        const sums = {}
        filteredExpenses.forEach(t => {
            if (t.supplier_id) {
                if (!sums[t.supplier_id]) sums[t.supplier_id] = 0
                sums[t.supplier_id] += Number(t.amount || 0)
            }
        })
        return sums
    }, [filteredExpenses])

    // Find top supplier
    const topSupplier = useMemo(() => {
        let max = 0
        let topId = null
        Object.entries(expensesBySupplier).forEach(([id, sum]) => {
            if (sum > max) {
                max = sum
                topId = id
            }
        })
        if (!topId) return null
        const supp = suppliers.find(s => s.id === topId)
        return supp ? { name: supp.name, total: max } : null
    }, [expensesBySupplier, suppliers])

    // Filter suppliers by search term
    const visibleSuppliers = useMemo(() => {
        if (!searchTerm) return suppliers
        const lower = searchTerm.toLowerCase()
        return suppliers.filter(s => 
            s.name.toLowerCase().includes(lower) || 
            (s.contact_name && s.contact_name.toLowerCase().includes(lower))
        )
    }, [suppliers, searchTerm])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header and Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Gestión de Proveedores</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Directorio y estadística de compras</p>
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
                    <div style={{ position: 'relative' }} className="search-container">
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Buscar proveedor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.5rem 1rem 0.5rem 2.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', width: '200px' }}
                        />
                    </div>
                    <button onClick={onAddSupplier} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} />
                        Nuevo Proveedor
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--primary)', color: 'white' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Compras (Periodo)</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{totalPurchases.toLocaleString()}€</h2>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={32} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Mayor Volumen de Compra</p>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>
                            {topSupplier ? topSupplier.name : 'Ninguno'}
                        </h2>
                        {topSupplier && (
                            <p style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600 }}>{topSupplier.total.toLocaleString()}€ comprados</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Suppliers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {visibleSuppliers.length === 0 ? (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No se encontraron proveedores.
                    </div>
                ) : (
                    visibleSuppliers.map(s => {
                        const purchases = expensesBySupplier[s.id] || 0
                        return (
                            <div key={s.id} className="card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => onEditSupplier(s)}
                                        style={{ padding: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
                                                onDeleteSupplier(s.id)
                                            }
                                        }}
                                        style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingRight: '4rem' }}>
                                    <div style={{ padding: '1rem', background: 'var(--surface-hover)', borderRadius: '12px' }}>
                                        <Users size={24} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{s.name}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{s.contact_name || 'Sin contacto'}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Comprado</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{purchases.toLocaleString()}€</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Día de Visita</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                            <Calendar size={14} color="var(--primary)" />
                                            {s.visit_day || 'Sin día fijo'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {s.bank_account && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                            <Landmark size={16} color="var(--text-muted)" />
                                            <span style={{ fontFamily: 'monospace' }}>{s.bank_account}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                        {s.payment_method === 'efectivo' ? <Banknote size={16} color="var(--success)" /> : <CreditCard size={16} color="var(--primary)" />}
                                        <span style={{ textTransform: 'capitalize' }}>Pago: {s.payment_method || 'banco'}</span>
                                    </div>
                                    {s.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            <Phone size={16} /> {s.phone}
                                        </div>
                                    )}
                                    {s.email && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            <Mail size={16} /> {s.email}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
