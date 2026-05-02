import React, { useState, useMemo } from 'react'
import { Plus, TrendingUp, Calendar, Edit2, Trash2, Clock, User, AlertTriangle, CreditCard, Banknote } from 'lucide-react'

export function DailySalesView({ sales, onAddSale, onEditSale, onDeleteSale, employees }) {
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [selectedMonth, setSelectedMonth] = useState('all')

    const years = Array.from(new Set(sales.map(s => new Date(s.date).getFullYear()))).sort((a, b) => b - a)
    if (!years.includes(currentYear)) years.unshift(currentYear)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    const filteredSales = useMemo(() => {
        return sales.filter(s => {
            const d = new Date(s.date)
            const matchYear = d.getFullYear() === Number(selectedYear)
            const matchMonth = selectedMonth === 'all' ? true : d.getMonth() === Number(selectedMonth)
            return matchYear && matchMonth
        })
    }, [sales, selectedYear, selectedMonth])

    const totalSales = filteredSales.reduce((sum, s) => sum + Number(s.amount), 0)
    const totalCash = filteredSales.reduce((sum, s) => sum + (Number(s.cash_amount) || 0), 0)
    const totalCard = filteredSales.reduce((sum, s) => sum + (Number(s.card_amount) || 0), 0)

    const cashGlobalPct = totalSales > 0 ? Math.round((totalCash / totalSales) * 100) : 0
    const cardGlobalPct = totalSales > 0 ? Math.round((totalCard / totalSales) * 100) : 0

    // Calcular descuadres por empleado
    const worstEmployee = useMemo(() => {
        const diffs = {}
        filteredSales.forEach(s => {
            const diff = Math.abs(Number(s.difference) || 0)
            if (diff > 0 && s.super_employees?.name) {
                const name = s.super_employees.name
                if (!diffs[name]) diffs[name] = { name, count: 0, total: 0 }
                diffs[name].count += 1
                diffs[name].total += diff
            }
        })
        let worst = null
        Object.values(diffs).forEach(emp => {
            if (!worst || emp.total > worst.total) worst = emp
        })
        return worst
    }, [filteredSales])

    const groupedSales = useMemo(() => {
        const groups = {}
        filteredSales.forEach(s => {
            if (!groups[s.date]) groups[s.date] = { total: 0, items: [] }
            groups[s.date].items.push(s)
            groups[s.date].total += Number(s.amount)
        })
        // Sort items inside groups by shift: 'mañana' first, then 'tarde'
        Object.values(groups).forEach(g => {
            g.items.sort((a, b) => (a.shift === 'mañana' ? -1 : 1))
        })
        return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
    }, [filteredSales])

    const renderBreakdown = (s) => {
        const total = Number(s.amount) || 0;
        const cash = Number(s.cash_amount) || 0;
        const card = Number(s.card_amount) || 0;

        if (total === 0 || (cash === 0 && card === 0)) {
            return <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin desglose</span>
        }

        const cashPct = Math.round((cash / total) * 100);
        const cardPct = Math.round((card / total) * 100);

        return (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', gap: '0.5rem' }}>
                <span>Efectivo: {cash.toLocaleString()}€ ({cashPct}%)</span>
                <span>|</span>
                <span>Tarjeta: {card.toLocaleString()}€ ({cardPct}%)</span>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cajas Diarias</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Registro de ingresos por ventas y cuadres</p>
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
                    <button onClick={onAddSale} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} />
                        Nueva Caja
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--primary)', color: 'white' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Ventas del Periodo</p>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalSales.toLocaleString()}€</h2>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Banknote size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>En Efectivo</p>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalCash.toLocaleString()}€</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>{cashGlobalPct}% del total</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>En Tarjeta</p>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalCard.toLocaleString()}€</h2>
                        <p style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>{cardGlobalPct}% del total</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: worstEmployee ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: worstEmployee ? 'var(--danger)' : 'var(--success)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{worstEmployee ? 'Mayor Descuadre' : 'Cuadres'}</p>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: worstEmployee ? 'var(--danger)' : 'var(--success)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {worstEmployee ? worstEmployee.name : 'Perfectos'}
                        </h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {worstEmployee ? `${worstEmployee.total.toLocaleString()}€ en ${worstEmployee.count} cajas` : '0 descuadres'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Turno</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Empleado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Importe y Desglose</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cuadre</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Notas</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedSales.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No hay registros de caja para este periodo.
                                </td>
                            </tr>
                        ) : (
                            groupedSales.map(([date, group]) => (
                                <React.Fragment key={date}>
                                    {/* Encabezado del Día */}
                                    <tr style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
                                        <td colSpan="6" style={{ padding: '0.75rem 1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                                    <Calendar size={16} color="var(--primary)" />
                                                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                                                    Total Día: {group.total.toLocaleString()}€
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    {/* Cajas del Día */}
                                    {group.items.map(s => (
                                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem 1rem 1rem 2.5rem' }}>
                                                {s.shift ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize' }}>
                                                        <Clock size={14} color="var(--text-muted)" /> {s.shift}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Única</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {s.super_employees?.name ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                        <User size={14} color="var(--text-muted)" />
                                                        {s.super_employees.name}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>-</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--success)' }}>
                                                    {Number(s.amount).toLocaleString()}€
                                                </div>
                                                {renderBreakdown(s)}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {Number(s.difference) !== 0 ? (
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        backgroundColor: Number(s.difference) > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: Number(s.difference) > 0 ? 'var(--success)' : 'var(--danger)'
                                                    }}>
                                                        <AlertTriangle size={12} />
                                                        {Number(s.difference) > 0 ? `Sobró ${s.difference}€` : `Faltó ${Math.abs(s.difference)}€`}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>OK</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {s.notes || '-'}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => onEditSale(s)} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--text-muted)' }}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => { if (confirm('¿Seguro?')) onDeleteSale(s.id) }} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--danger)' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
