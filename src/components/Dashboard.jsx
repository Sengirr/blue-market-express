import React from 'react'
import { TrendingUp, TrendingDown, Target as TargetIcon, Calendar, User, Euro } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function DashboardView({ stats, chartData, budgets, transactions, sales }) {
    const recentSales = (sales || []).slice(0, 5)

        </div >
    )
}
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
