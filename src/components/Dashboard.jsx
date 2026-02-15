import React from 'react'
import { TrendingUp, TrendingDown, Target as TargetIcon, Calendar, User, Euro } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function DashboardView({ stats, chartData, budgets, transactions, sales }) {
    const recentSales = (sales || []).slice(0, 5)

    const calculateBudgetProgress = (budget) => {
        if (budget.type === 'sales_goal') {
            const relevantSales = (sales || []).filter(s => {
                const saleDate = new Date(s.date)
                return saleDate.getMonth() + 1 === budget.month &&
                    saleDate.getFullYear() === budget.year
            })
            const directSalesAmount = relevantSales.reduce((sum, s) => sum + Number(s.amount), 0)

            const relevantTrans = transactions.filter(t => {
                const transDate = new Date(t.date)
                return transDate.getMonth() + 1 === budget.month &&
                    transDate.getFullYear() === budget.year &&
                    t.type === 'income' &&
                    (!budget.category_id || t.category_id === budget.category_id)
            })
            const otherIncome = relevantTrans.reduce((sum, t) => sum + Number(t.amount), 0)

            return directSalesAmount + otherIncome
        } else {
            const relevantTrans = transactions.filter(t => {
                const transDate = new Date(t.date)
                return transDate.getMonth() + 1 === budget.month &&
                    transDate.getFullYear() === budget.year &&
                    t.type === 'expense' &&
                    (!budget.category_id || t.category_id === budget.category_id)
            })
            return relevantTrans.reduce((sum, t) => sum + Number(t.amount), 0)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <StatCard
                    label="Beneficio Neto"
                    value={`${stats.profit.toLocaleString()}€`}
                    trend="+12.5%"
                    icon={<TrendingUp color="var(--success)" />}
                />
                <StatCard
                    label="Gastos Totales"
                    value={`${stats.expenses.toLocaleString()}€`}
                    trend="-2.4%"
                    icon={<TrendingDown color="var(--danger)" />}
                />
                <StatCard
                    label="Ingresos (Caja + Otros)"
                    value={`${stats.income.toLocaleString()}€`}
                    trend="+8.1%"
                    icon={<TrendingUp color="var(--success)" />}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Chart */}
                <div className="card" style={{ height: '400px', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 700 }}>Evolución Financiera</h3>
                    <div style={{ width: '100%', height: 'calc(100% - 3rem)' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
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
                                    tickFormatter={(value) => `${value}€`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius)',
                                        color: 'white'
                                    }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Bar dataKey="net" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.net >= 0 ? 'var(--success)' : 'var(--danger)'} opacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Últimas Cajas</h3>
                        <TrendingUp size={18} color="var(--success)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentSales.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No hay ventas registradas.</p>
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

            {/* Budgets Summary */}
            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cumplimiento de Objetivos</h3>
                    <TargetIcon size={20} color="var(--primary)" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {budgets.slice(0, 4).map(b => {
                        const current = calculateBudgetProgress(b)
                        const percentage = Math.min((current / Number(b.amount)) * 100, 100)
                        return (
                            <div key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                                        {b.type === 'sales_goal' ? 'Meta de Ventas' : 'Límite de Gastos'}
                                        <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>({b.month}/{b.year})</span>
                                    </span>
                                    <span style={{ fontWeight: 700, color: percentage >= 100 && b.type === 'sales_goal' ? 'var(--success)' : 'var(--text)' }}>
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--background)', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${percentage}%`,
                                        height: '100%',
                                        background: b.type === 'expense_limit' && percentage > 90 ? 'var(--danger)' : 'var(--primary)',
                                        borderRadius: '999px',
                                        transition: 'width 0.5s ease-out'
                                    }} />
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                                    {current.toLocaleString()}€ / {Number(b.amount).toLocaleString()}€
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, trend, icon }) {
    return (
        <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
                <div style={{ padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    {icon}
                </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</div>
            <div style={{
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: trend.startsWith('+') ? 'var(--success)' : 'var(--danger)'
            }}>
                <span style={{ fontWeight: 600 }}>{trend}</span>
                <span style={{ color: 'var(--text-muted)' }}>vs mes anterior</span>
            </div>
        </div>
    )
}
