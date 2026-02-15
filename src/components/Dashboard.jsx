import React from 'react'
import { TrendingUp, TrendingDown, Calendar, Euro, Filter } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function DashboardView({
    stats,
    chartData,
    sales,
    selectedYear,
    selectedMonth,
    onYearChange,
    onMonthChange
}) {
    const recentSales = (sales || [])
        .filter(s => {
            const d = new Date(s.date)
            const matchYear = d.getFullYear() === Number(selectedYear)
            const matchMonth = selectedMonth === 'all' ? true : d.getMonth() === Number(selectedMonth)
            return matchYear && matchMonth
        })
        .slice(0, 5)

    const years = [2013, 2024, 2025, 2026]
    const months = [
        { val: 'all', label: 'Todos los meses' },
        { val: 0, label: 'Enero' }, { val: 1, label: 'Febrero' }, { val: 2, label: 'Marzo' },
        { val: 3, label: 'Abril' }, { val: 4, label: 'Mayo' }, { val: 5, label: 'Junio' },
        { val: 6, label: 'Julio' }, { val: 7, label: 'Agosto' }, { val: 8, label: 'Septiembre' },
        { val: 9, label: 'Octubre' }, { val: 10, label: 'Noviembre' }, { val: 11, label: 'Diciembre' }
    ]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'var(--surface)',
                    padding: '1rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                    <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>{label}</p>
                    <p style={{
                        color: payload[0].value >= 0 ? 'var(--success)' : 'var(--danger)',
                        fontWeight: 600,
                        fontSize: '1.1rem'
                    }}>
                        {payload[0].value.toLocaleString()}€
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Filter Bar */}
            <div className="card" style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem 1.5rem',
                alignItems: 'center',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)'
            }}>
                <Filter size={18} color="var(--primary)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', marginRight: '0.5rem' }}>Filtrar Periodo:</span>

                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        background: 'var(--background)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)'
                    }}
                >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                <select
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        background: 'var(--background)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)'
                    }}
                >
                    {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                </select>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="stats-grid">
                <StatCard
                    label="Beneficio Neto"
                    value={`${stats.profit.toLocaleString()}€`}
                    trend={stats.trends?.profit || '0%'}
                    comparisonText={selectedMonth === 'all' ? 'vs año anterior' : 'vs mes anterior'}
                    icon={<TrendingUp size={20} color="var(--success)" />}
                />
                <StatCard
                    label="Gastos Totales"
                    value={`${stats.expenses.toLocaleString()}€`}
                    trend={stats.trends?.expenses || '0%'}
                    comparisonText={selectedMonth === 'all' ? 'vs año anterior' : 'vs mes anterior'}
                    invertTrend={true}
                    icon={<TrendingDown size={20} color="var(--danger)" />}
                />
                <StatCard
                    label="Ingresos (Caja + Otros)"
                    value={`${stats.income.toLocaleString()}€`}
                    trend={stats.trends?.income || '0%'}
                    comparisonText={selectedMonth === 'all' ? 'vs año anterior' : 'vs mes anterior'}
                    icon={<TrendingUp size={20} color="var(--success)" />}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="charts-grid">
                {/* Chart */}
                <div className="card" style={{ height: '400px', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 700 }}>Evolución Financiera {selectedYear}</h3>
                    <div style={{ width: '100%', height: 'calc(100% - 3rem)' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--primary-light)', opacity: 0.1 }} />
                                <Bar dataKey="net" radius={[4, 4, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.net >= 0 ? 'var(--success)' : 'var(--danger)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Cajas del Periodo</h3>
                        <TrendingUp size={18} color="var(--success)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentSales.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No hay ventas en este periodo.</p>
                        ) : (
                            recentSales.map(s => (
                                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', background: 'var(--background)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} color="var(--text-muted)" />
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{new Date(s.date).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: 600 }}>+{Number(s.amount).toLocaleString()}€</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, trend, icon, comparisonText, invertTrend = false }) {
    const isPositive = trend.startsWith('+')
    const color = isPositive
        ? (invertTrend ? 'var(--danger)' : 'var(--success)')
        : (invertTrend ? 'var(--success)' : 'var(--danger)')

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--background)', borderRadius: '8px' }}>
                    {icon}
                </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</div>
            <div style={{
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
            }}>
                <span style={{ fontWeight: 600, color: color }}>{trend}</span>
                <span style={{ color: 'var(--text-muted)' }}>{comparisonText}</span>
            </div>
        </div>
    )
}
