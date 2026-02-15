import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function DashboardView({ stats, chartData }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <StatCard
                    label="Beneficio Neto"
                    value={`$${stats.profit.toLocaleString()}`}
                    trend="+12.5%"
                    icon={<TrendingUp color="var(--success)" />}
                />
                <StatCard
                    label="Gastos Totales"
                    value={`$${stats.expenses.toLocaleString()}`}
                    trend="-2.4%"
                    icon={<TrendingDown color="var(--danger)" />}
                />
                <StatCard
                    label="Ingresos Totales"
                    value={`$${stats.income.toLocaleString()}`}
                    trend="+8.1%"
                    icon={<TrendingUp color="var(--success)" />}
                />
            </div>

            {/* Chart */}
            <div className="card" style={{ height: '450px', padding: '2rem' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 700 }}>Evolución Mensual</h3>
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
                                tickFormatter={(value) => `$${value}`}
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
